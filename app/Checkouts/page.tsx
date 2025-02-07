"use client";

import { ChevronDown, Clock, Eye, Box } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CheckoutHistory {
  id: string;
  user_id: string;
  user_email: string;
  pbi_ids: string[];
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  pbi_count: number;
  total_effort: number;
}

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SIZE_MAPPING, TSIZE_DAYS } from "@/components/pbi-table";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const columns: ColumnDef<CheckoutHistory>[] = [
  {
    accessorKey: "user_email",
    header: "User",
    cell: ({ row }) => <span>{row.getValue("user_email")}</span>,
  },
  {
    accessorKey: "pbi_count",
    header: "Items",
    cell: ({ row }) => (
      <Badge variant="secondary">
        <Box className="h-4 w-4 text-muted-foreground me-1" />
        {row.getValue<number>("pbi_count")} PBIs
      </Badge>
    ),
  },
  {
    accessorKey: "total_effort",
    header: "Total Effort",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue<number>("total_effort")} days</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log("View details:", row.original)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

function TableSkeleton() {
  return (
    <div className="border-b-2 border-gray-200">
      <Table className="m-0">
        <TableHeader className="bg-gray-100 uppercase">
          <TableRow className="border-none">
            {[...Array(6)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className="border-b">
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CheckoutHistory() {
  const [data, setData] = useState<CheckoutHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [selectedValue, setSelectedValue] = useState("30");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCheckoutHistory = async () => {
    try {
      setIsLoading(true);
      const { data: checkouts, error } = await supabase
        .from("checkout")
        .select(
          `
          *,
          users:user_id (email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const checkoutsWithDetails = await Promise.all(
        checkouts.map(async (checkout) => {
          const { data: pbis } = await supabase
            .from("PBI")
            .select("t_size")
            .in("id", checkout.pbi_ids);

          const totalEffort =
            pbis?.reduce((total, pbi) => {
              const size =
                SIZE_MAPPING[
                  pbi.t_size.toLowerCase() as keyof typeof SIZE_MAPPING
                ];
              return total + TSIZE_DAYS[size];
            }, 0) || 0;

          return {
            ...checkout,
            user_email: checkout.users.email,
            pbi_count: checkout.pbi_ids.length,
            total_effort: totalEffort,
          };
        })
      );

      setData(checkoutsWithDetails);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add pagination calculations
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(start, end);

  // Update table configuration
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    fetchCheckoutHistory();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-3">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
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
                                : header.index ===
                                  headerGroup.headers.length - 1
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
