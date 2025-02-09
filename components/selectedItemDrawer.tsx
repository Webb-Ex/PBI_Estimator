import { useRef, useCallback } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, X, Clock, Users, CircleDot, ListChecks, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { calculateMetrics } from "@/lib/metrics";
import { SIZE_MAPPING, TSIZE_DAYS, SPRINT_DATA } from "@/constants/constants";
import { TSizeBadge } from "./tSizeBadge";

interface SelectedItemsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRows: Row<any>[];
  tableData: any[];
  onClose: () => void;
}

export function SelectedItemsDrawer({
  isOpen,
  onOpenChange,
  selectedRows,
  tableData,
  onClose,
}: SelectedItemsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    try {
      const drawerContent = drawerRef.current;
      if (!drawerContent) {
        console.error("Drawer content not found");
        return;
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        console.error("Could not open print window");
        return;
      }

      const styleSheets = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            return "";
          }
        })
        .join("");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              ${styleSheets}
              body {
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
              }
              @media print {
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${drawerContent.outerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error("Print error:", error);
    }
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]" ref={drawerRef}>
        <DrawerHeader className="flex justify-between">
          <DrawerTitle>Selected PBIs</DrawerTitle>
          <div className="flex gap-2">
            <Button
              className="py-2 px-2 no-print"
              variant="outline"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              className="py-2 px-2 no-print"
              variant="outline"
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-6 grid grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Selected Features
                  </CardTitle>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      {calculateMetrics(selectedRows).totalFeatures}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <Badge
                        variant="secondary"
                        className="text-xs w-fit text-nowrap"
                      >
                        <CircleDot className="h-3 w-3 mr-1" />
                        {selectedRows.length} of {tableData.length} items
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ListChecks className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Effort Card */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Effort
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {calculateMetrics(selectedRows).totalTSizeDays}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        days
                      </span>
                    </div>
                    <div className="flex flex-row gap-1 mt-2">
                      <Badge
                        variant="secondary"
                        className="text-xs w-fit text-nowrap"
                      >
                        <Clock className="h-3 w-3 mr-1" />~
                        {Math.ceil(
                          calculateMetrics(selectedRows).totalTSizeDays / 30
                        )}{" "}
                        months
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs w-fit text-nowrap"
                      >
                        {Math.ceil(
                          calculateMetrics(selectedRows).totalTSizeDays / 10
                        )}{" "}
                        sprints
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarDays className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Resource Allocation Card */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resource Planning
                  </CardTitle>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      {Math.max(
                        ...selectedRows.map((row) => {
                          const tSize = row.getValue("t_size") as string;
                          const sizeKey =
                            tSize.toLowerCase() as keyof typeof SIZE_MAPPING;
                          const size = SIZE_MAPPING[sizeKey];
                          return SPRINT_DATA[size as keyof typeof SPRINT_DATA]
                            .months;
                        })
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <Badge
                        variant="secondary"
                        className="text-xs w-fit text-nowrap"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Max months per resource
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Selected Items Table */}
          <Card className="col-span-full max-h-[calc(90vh-16rem)] overflow-y-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium w-[10%]">
                    T-Size
                  </TableHead>
                  <TableHead className="font-medium w-[15%]">
                    Effort
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {selectedRows.length > 0 ? (
                    selectedRows.map((row) => {
                      const dbSize = (
                        row.getValue("t_size") as string
                      ).toLowerCase() as keyof typeof SIZE_MAPPING;
                      const mappedSize = SIZE_MAPPING[dbSize];
                      const effortDays =
                        TSIZE_DAYS[mappedSize as keyof typeof TSIZE_DAYS];

                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="border-b hover:bg-slate-50"
                        >
                          <TableCell>{row.getValue("name")}</TableCell>
                          <TableCell>{row.getValue("description")}</TableCell>
                          <TableCell>
                            <TSizeBadge size={row.getValue("t_size")} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{effortDays} days</span>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No items selected
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </Card>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}