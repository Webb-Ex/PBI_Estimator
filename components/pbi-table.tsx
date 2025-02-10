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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Search,
  ExternalLink,
  ListChecks,
  Clock,
} from "lucide-react";
import { Input } from "./ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { supabase } from "@/lib/supabaseClient";
import {
  ColumnDef,
  FilterFnOption,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LikeButton } from "./like-button";
import { CheckoutDialog } from "./checkout-dialogue";
import { TSizeBadge } from "./tSizeBadge";
import { calculateMetrics } from "@/lib/metrics";
import { SelectedItemsDrawer } from "./selectedItemDrawer";

import { PBI } from "@/constants/constants";
import { TSizeScale } from "./TSizeScale";
import { PBITableSkeleton } from "./skeletons/pbiTableSkeleton";


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

export const columns: ColumnDef<PBI, any>[] = [
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
    accessorKey: "product",
    header: "Product(s)",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-medium text-nowrap">
        {row.getValue("product")}
      </Badge>
    ),
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtering, setFiltering] = useState("");

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

  const updateLocalLikes = (pbiId: string, newLikeCount: number) => {
    setTableData(prev => prev.map(item => 
      item.id === pbiId ? { ...item, likes: newLikeCount } : item
    ));
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("public:pbi_likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pbi_likes" },
        async (payload: any) => {
          if (payload.new) {
            // Get all likes for this PBI and sum them
            const { data: likesData, error } = await supabase
              .from("pbi_likes")
              .select("like_count")
              .eq("pbi_id", payload.new.pbi_id);

            if (!error && likesData) {
              const totalLikes = likesData.reduce((sum, record) => sum + (record.like_count || 0), 0);
              updateLocalLikes(payload.new.pbi_id, totalLikes);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const table = useReactTable<PBI>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Add pagination state
    state: {
      globalFilter: filtering,
      pagination: {
        pageIndex: currentPage - 1, // TanStack Table uses 0-based index
        pageSize: itemsPerPage,
      },
    },
    // Add pagination functions
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize: itemsPerPage,
        });
        setCurrentPage(newState.pageIndex + 1);
        setItemsPerPage(newState.pageSize);
      }
    },
    onGlobalFilterChange: setFiltering,
    filterFns: {
      fuzzy: (row, id, filterValue) => {
        const name = row.getValue("name")?.toString().toLowerCase() || "";
        const description = row.getValue("description")?.toString().toLowerCase() || "";
        const searchTerm = filterValue.toLowerCase();
        return name.includes(searchTerm) || description.includes(searchTerm);
      },
    },
    globalFilterFn: 'fuzzy' as FilterFnOption<PBI>,
    // Enable client-side pagination
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(tableData.length / itemsPerPage),
  });

  const selectedRow = table.getFilteredSelectedRowModel().rows;

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  if (isLoading) {
    return <PBITableSkeleton />
  }

  return (
    <>
      <SelectedItemsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedRows={selectedRow}
        tableData={tableData}
        onClose={handleDrawerClose}
      />
      <div className="w-full mb-3 px-1">

        <CheckoutDialog
          selectedRow={selectedRow}
          tableData={tableData}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mode="checkout"
        />

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

          <TSizeScale />
          
          <div className="flex items-center">
            <Select value={productFilter}
              onValueChange={(value) => {
                setProductFilter(value);
                // Fix: Use lowercase "all" and handle empty filter correctly
                table.getColumn('product')?.setFilterValue(value.toLowerCase() === "all" ? "" : value);
              }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Products</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  {Array.from(new Set(tableData.map(item => item.product))).map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
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
                          className={`font-bold text-gray-700 ${header.index === 0
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
                    <Button variant="outline" className="flex items-center gap-2 px-2 py-1">
                      {table.getState().pagination.pageSize}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => table.setPageSize(size)}
                      >
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Previous
                      </Button>
                    </PaginationItem>

                    {/* Generate page numbers */}
                    {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => table.setPageIndex(page - 1)}
                            isActive={table.getState().pagination.pageIndex === page - 1}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        Next
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>

            <div className=" mt-3">
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
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

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenDrawer}
                        className="ml-4"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      disabled={selectedRow.length === 0}
                    >
                      Proceed to checkout ({selectedRow.length})
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
