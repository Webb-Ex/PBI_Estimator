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
  ListChecks,
  Clock,
  TrendingDown,
  BarChart3,
  CalendarDays,
  PieChart,
  CircleDot,
  Users,
  Info,
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
  SelectSeparator,
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export const SIZE_MAPPING = {
  small: "SM",
  medium: "MD",
  large: "LG",
  "extra small": "XS",
  "extra large": "XL",
} as const;

export const TSIZE_COLORS = {
  XS: "#34b85c",
  SM: "#5bbdde",
  MD: "#eccc48",
  LG: "#e16d6d",
  XL: "#9a86eb",
} as const;

export const TSIZE_DAYS = {
  XS: 20,
  SM: 60,
  MD: 100,
  LG: 150,
  XL: 220,
} as const;

export const SIZE_DISPLAY_NAMES = {
  XS: "Extra Small",
  SM: "Small",
  MD: "Medium",
  LG: "Large",
  XL: "Extra Large",
} as const;

const SPRINT_DATA = {
  XS: { sprints: 2, months: 1, range: "0-20" },
  SM: { sprints: 6, months: 3, range: "21-60" },
  MD: { sprints: 10, months: 5, range: "61-100" },
  LG: { sprints: 15, months: 7.5, range: "101-150" },
  XL: { sprints: 22, months: 11, range: "151-220" },
} as const;

interface PBI {
  id: string;
  name: string;
  description: string;
  t_size: string;
  likes: number;
}

interface PBILike {
  pbi_id: string;
  user_id: string;
  like_count: number;
  created_at: string;
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

function TSizeBadge({ size }: { size: string }) {
  const normalizedSize = size.toLowerCase() as keyof typeof SIZE_MAPPING;
  const mappedSize = SIZE_MAPPING[normalizedSize];
  const days = TSIZE_DAYS[mappedSize];
  const color = TSIZE_COLORS[mappedSize];

  return (
    <div className="relative group">
      <Badge
        className="rounded-full font-medium text-xs"
        style={{
          backgroundColor: color,
          opacity: 0.9,
        }}
      >
        {mappedSize}
      </Badge>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-xs text-white px-2 py-1 rounded whitespace-nowrap z-50">
        {days} Days - {SIZE_DISPLAY_NAMES[mappedSize]}
      </div>
    </div>
  );
}

const updateLikes = async (pbiId: string, userId: string) => {
  try {
    // Check for existing like
    const { data: existing, error: selectError } = await supabase
      .from("pbi_likes")
      .select("*")
      .eq("pbi_id", pbiId)
      .eq("user_id", userId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (existing) {
      let newCount = existing.like_count + 1;

      console.log("newcount", existing.like_count, newCount);

      const { data, error: updateError } = await supabase
        .from("pbi_likes")
        .update({
          like_count: newCount,
        })
        .eq("id", existing.id)
        .select();

      if (updateError) throw updateError;
      return data;
    } else {
      // Insert new like record
      const { data, error: insertError } = await supabase
        .from("pbi_likes")
        .insert({
          pbi_id: pbiId,
          user_id: userId,
          like_count: 1,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      console.log("Inserted new like:", data);
      return data;
    }
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
    cell: ({ row }) => <TSizeBadge size={row.getValue("t_size")} />,
  },
  {
    accessorKey: "likes",
    header: "Likes",
    cell: ({ row }) => {
      // Replace this with the actual current user ID from your authentication context
      const currentUserId = "f7ab4717-efdc-4579-a73a-5c2416d49ce3";
      return (
        <LikeButton
          likes={row.original.likes}
          id={row.original.id}
          onLike={async (id) => {
            // Pass the proper user id instead of Number(currentLikes)
            const data = await updateLikes(id, currentUserId);
            if (!data) {
              console.error("Failed to update likes");
            }
          }}
        />
      );
    },
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
      const [pbiResponse, likesResponse] = await Promise.all([
        supabase.from("PBI").select("*"),
        supabase.from("pbi_likes").select("pbi_id, like_count"),
      ]);

      if (pbiResponse.error) throw pbiResponse.error;
      if (likesResponse.error) throw likesResponse.error;

      const aggregatedLikes = likesResponse.data.reduce(
        (acc: Record<string, number>, curr) => {
          acc[curr.pbi_id] = (acc[curr.pbi_id] || 0) + Number(curr.like_count);
          return acc;
        },
        {}
      );

      const mergedData = pbiResponse.data.map((pbi) => ({
        ...pbi,
        likes: aggregatedLikes[pbi.id] || 0,
      }));

      setTableData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("public:pbi_likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pbi_likes" },
        async () => {
          // Refetch data to get updated aggregated likes
          await fetchData();
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
              {/* <DrawerDescription>Items</DrawerDescription> */}
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
                        {calculateMetrics(selectedRow).totalFeatures}
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-xs w-fit text-nowrap"
                        >
                          <CircleDot className="h-3 w-3 mr-1" />
                          {selectedRow.length} of {tableData.length} items
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
                          {calculateMetrics(selectedRow).totalTSizeDays}
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
                            calculateMetrics(selectedRow).totalTSizeDays / 30
                          )}{" "}
                          months
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs w-fit text-nowrap"
                        >
                          {Math.ceil(
                            calculateMetrics(selectedRow).totalTSizeDays / 10
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
                          ...selectedRow.map((row) => {
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
            <Card className="col-span-full">
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
                    {selectedRow.length > 0 ? (
                      selectedRow.map((row) => {
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

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className="w-full mb-3 px-1">
        <div className="flex mb-3 gap-3 w-full">
          {/* <Card className="w-[40%]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="">
                  <CardTitle>Available PBIs</CardTitle>
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 leading-none text-muted-foreground mt-2">
                        Showing PBIs from all products{" "}
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="p-3" onClick={handleOpenDrawer}>
                  <ExternalLink width={20} height={20} />
                </Button>
              </div>

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
          </Card> */}
          {/* <Card className="w-[30%]">
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
          </Card> */}
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

          <Card className="flex items-center border-0 shadow-none">
            <CardHeader className="">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                T-Size Scale
              </CardTitle>
            </CardHeader>
            <CardContent className="m-0 p-0">
              <div className="flex items-center gap-3">
                {Object.entries(TSIZE_COLORS).map(([size, color]) => (
                  <div
                    key={size}
                    className="group relative flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                  >
                    <span
                      className="w-2 h-2 rounded-full transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium">{size}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {TSIZE_DAYS[size as keyof typeof TSIZE_DAYS]}d
                    </span>
                    <div className="absolute -bottom-8 left-0 hidden group-hover:block bg-slate-900 text-xs text-white px-2 py-1 rounded whitespace-nowrap">
                      {TSIZE_DAYS[size as keyof typeof TSIZE_DAYS] +
                        " Days" +
                        " - " +
                        SIZE_DISPLAY_NAMES[
                          size as keyof typeof SIZE_DISPLAY_NAMES
                        ]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center">
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

            <div className=" mt-3">
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center ">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-violet-700" />
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-muted-foreground">
                            Selected:
                          </span>
                          <span className="font-bold">
                            {calculateMetrics(selectedRow).totalFeatures}
                          </span>
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-4" />

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-700" />
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-muted-foreground">
                            Total Effort:
                          </span>
                          <span className="font-bold">
                            {calculateMetrics(selectedRow).totalTSizeDays}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            days
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleOpenDrawer}
                      className="ml-4"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
