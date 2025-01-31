"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Search,
  TrendingUp,
  ExternalLink,
  MoreHorizontal,
  ArrowUpDown,
  X,
  Hash,
  CalendarClock,
  Printer,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { supabase } from "@/lib/supabaseClient";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { LikeButton } from "./like-button";

export const SIZE_MAPPING = {
  small: "SM",
  medium: "MD",
  large: "LG",
  "extra small": "XS",
  "extra large": "XL",
} as const;

export const TSIZE_COLORS = {
  XS: "#6E8E59",
  SM: "#DE3163",
  MD: "#493D9E",
  LG: "#543A14",
  XL: "#727D73",
} as const;

export const TSIZE_DAYS = {
  XS: 16,
  SM: 30,
  MD: 45,
  LG: 70,
  XL: 120,
} as const;

export const SIZE_DISPLAY_NAMES = {
  XS: "Extra Small",
  SM: "Small",
  MD: "Medium",
  LG: "Large",
  XL: "Extra Large",
} as const;

interface PBI {
  id: string;
  name: string;
  description: string;
  t_size: string;
  likes: number;
}

interface RealtimePayload {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: string;
  new: PBI;
  old: { id: string };
  errors: null | any;
}

const updateLikes = async (id: string, currentLikes: number) => {
  try {
    const { data, error } = await supabase
      .from("PBI")
      .update({ likes: currentLikes + 1 })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating likes:", error);
    return null;
  }
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "t_size",
    header: "T-size",
    cell: ({ row }) => <span>{row.getValue("t_size")}</span>,
  },
  {
    accessorKey: "likes",
    header: "Likes",
    cell: ({ row }) => (
      <LikeButton
        likes={row.original.likes}
        id={row.original.id}
        onLike={async (id) => {
          const currentLikes = row.original.likes;

          const data = await updateLikes(id, Number(currentLikes));
          if (!data) {
            console.error("Failed to update likes");
          }
        }}
      />
    ),
  },
];

export default function PBITable() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState("bottom");
  const [selectedValue, setSelectedValue] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedItems, setSelectedItems] = useState<Row<any>[]>([]);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("PBI").select("*");

      if (error) {
        throw new Error(error.message);
      }

      setTableData(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("public:PBI")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "PBI" },
        (payload) => {
          //console.log("Update payload:", payload);

          setTableData((prevData) =>
            prevData.map((row) =>
              row.id === payload.new.id
                ? { ...row, likes: payload.new.likes }
                : row
            )
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === tableData.length
        ? []
        : tableData.map((row, index) => String(index))
    );
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const selectedRow = table.getFilteredSelectedRowModel().rows;

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true); // Open the drawer
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false); // Open the drawer
  };

  const selectedRowNames = selectedRow.map((row) => row.getValue("name"));

  const calculateMetrics = (selectedRows: any[]) => {
    const totalFeatures = selectedRows.length;

    const totalTSizeDays = selectedRows.reduce((total, row) => {
      try {
        const dbSize =
          (row
            .getValue("t_size")
            ?.toLowerCase() as keyof typeof SIZE_MAPPING) || "";
        console.log("Raw size:", dbSize); // Debug log

        if (!dbSize || !SIZE_MAPPING[dbSize]) {
          console.warn(`Invalid size value: ${dbSize}`);
          return total;
        }

        const mappedSize = SIZE_MAPPING[dbSize];
        console.log(
          "Mapped size:",
          mappedSize,
          "Days:",
          TSIZE_DAYS[mappedSize]
        ); // Debug log

        return total + TSIZE_DAYS[mappedSize];
      } catch (error) {
        console.error("Error calculating T-Size:", error);
        return total;
      }
    }, 0);

    return {
      totalFeatures,
      totalTSizeDays: totalTSizeDays || 0,
    };
  };

  const drawerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    try {
      // Use ref instead of querySelector
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

      // Get all stylesheet links
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
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-full" ref={drawerRef}>
          <DrawerHeader className="flex justify-between">
            <div className="">
              <DrawerTitle>Selected PBIs</DrawerTitle>
              <DrawerDescription>Items</DrawerDescription>
            </div>

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
                onClick={handleDrawerClose}
              >
                <X />
              </Button>
            </div>
          </DrawerHeader>

          <div className="p-4 flex gap-2">
            <Card className="w-[25%]">
              <CardHeader className="pb-3">
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <h1 className="tracking-tight text-sm font-medium">
                      Features Selected
                    </h1>
                    <Hash width={15} height={15} className="text-gray-600" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <h1 className="text-2xl font-bold">
                    {calculateMetrics(selectedRow).totalFeatures}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="w-[25%]">
              <CardHeader className="pb-3">
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <h1 className="tracking-tight text-sm font-medium">
                      Total T-Size
                    </h1>
                    <CalendarClock
                      width={15}
                      height={15}
                      className="text-gray-600"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <h1 className="text-2xl font-bold">
                    {calculateMetrics(selectedRow).totalTSizeDays}
                  </h1>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4">
            <Table className="m-0">
              <TableHeader className="bg-gray-100 uppercase">
                <TableRow className="border-none">
                  {columns.slice(1).map((column, index) => (
                    <TableHead
                      key={column.id}
                      className={`font-bold text-gray-700 ${
                        index === 0
                          ? " rounded-tl-lg rounded-bl-lg"
                          : index === columns.length - 2
                          ? "rounded-br-lg rounded-tr-lg"
                          : ""
                      }`}
                    >
                      {typeof column.header === "string"
                        ? column.header
                        : column.id}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {selectedRow.length > 0 ? (
                    selectedRow.map((row) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border-b"
                      >
                        {row
                          .getVisibleCells()
                          .slice(1)
                          .map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow className="text-center">
                      <TableCell
                        colSpan={columns.length - 1}
                        className="h-24 py-3 text-gray-500"
                      >
                        No rows selected.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className="w-full mb-3 px-1">
        <div className="flex mb-3 gap-3 w-full">
          <Card className="w-[40%]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="">
                  <CardTitle>Available PBIs</CardTitle>
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 leading-none text-muted-foreground mt-2">
                        Showing PBIs from all products <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="p-3" onClick={handleOpenDrawer}>
                  <ExternalLink width={20} height={20} />
                </Button>
              </div>
              {/* <CardDescription>All selected PBIs</CardDescription> */}
            </CardHeader>
            <Separator className="" />
            <CardContent className="p-6">
              <div className="flex gap-1 flex-wrap">
                {selectedRow.length > 0 ? (
                  selectedRow.map((row) => {
                    const dbSize = (
                      row.getValue("t_size") as string
                    ).toLowerCase() as keyof typeof SIZE_MAPPING;
                    const mappedSize = SIZE_MAPPING[dbSize];
                    return (
                      <Badge
                        key={row.id}
                        className="rounded-full"
                        style={{ backgroundColor: TSIZE_COLORS[mappedSize] }}
                      >
                        {row.getValue("name")}
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No items selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="w-[30%]">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <h1>T-Sizing Details</h1>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {Object.entries(TSIZE_COLORS).map(([size, color]) => (
                  <div
                    key={size}
                    className="flex gap-6 items-center justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <span
                        className="w-4 h-4 rounded-full p-1"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-gray-600 text-xs">{size}</span>
                      <span className="text-gray-600 text-sm">
                        {
                          SIZE_DISPLAY_NAMES[
                            size as keyof typeof SIZE_DISPLAY_NAMES
                          ]
                        }
                      </span>
                    </div>
                    <div className="font-bold">
                      {TSIZE_DAYS[size as keyof typeof TSIZE_DAYS]} Days
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              onChange={(event) =>
                table
                  .getColumn("description")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Products</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Digital Banking">
                    Digital Banking
                  </SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Sparrow">Sparrow</SelectItem>
                  <SelectItem value="Bill Payments">Bill Payments</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="m-0 p-3">
          <div>
            <div className="border-b-2 border-gray-200">
              <Table className="m-0">
                <TableHeader className="bg-gray-100 uppercase">
                  <TableRow className="border-none">
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={`font-bold text-gray-700 ${
                            header.index === 0
                              ? "w-[50px] rounded-tl-lg rounded-bl-lg"
                              : header.index === headerGroup.headers.length - 1
                              ? "rounded-br-lg rounded-tr-lg"
                              : ""
                          }`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="border-b"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow className="text-center">
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 py-3 text-gray-500"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex gap-2 items-center">
                <p className="text-sm">Items Per Page</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      {selectedValue} <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-5">
                    {[10, 20, 30].map((value) => (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => setSelectedValue(value.toString())}
                      >
                        {value}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, pageIndex) => (
                      <PaginationItem key={pageIndex}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageIndex + 1}
                          onClick={() => setCurrentPage(pageIndex + 1)}
                        >
                          {pageIndex + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
