"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
    header: "Like",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <Heart /> {row.getValue("likes")}
      </Button>
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

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-full">
          <DrawerHeader className="flex justify-between">
            <div className="">
            <DrawerTitle>Selected PBIs</DrawerTitle>
            <DrawerDescription>Items</DrawerDescription>
            </div>
            <Button className="py-2 px-2" variant="outline" onClick={handleDrawerClose}>
            <X />
          </Button>
          </DrawerHeader>

          <div className="p-4">
            <Table className="m-0">
              <TableHeader className="bg-gray-100 uppercase">
                <TableRow className="border-none">
                  {columns.slice(1).map((column, index) => (
                    <TableHead
                      key={column.id}
                      className={`font-bold text-gray-700 ${
                        index === 0
                          ? "w-[50px] rounded-tl-lg rounded-bl-lg"
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
                </div>
                <Button className="p-3" onClick={handleOpenDrawer}>
                  <ExternalLink width={20} height={20} />
                </Button>
              </div>
              <CardDescription>
                Showing total visitors for the last 6 months
              </CardDescription>
            </CardHeader>
            <Separator className="" />
            <CardContent className="p-6">
              <div className="flex gap-1">
                <Badge className="rounded-full"> Task1 </Badge>
                <Badge className="rounded-full"> Task2 </Badge>
                <Badge className="rounded-full"> Task3 </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Showing PBIs from all products
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="w-[30%]">
            <CardHeader>
              <CardTitle>Area Chart - Stacked</CardTitle>
              <CardDescription>
                Showing total visitors for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
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
