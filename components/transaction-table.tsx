"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  DollarSign,
  Maximize,
  Minus,
  MoreHorizontal,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { BarGraph } from "./bar-graph";
import { HorizontalGraph } from "./horizontal-graph";
import { AreaGraph } from "./area-graph";
import { StackedBarGraph } from "./stacked-bargraph";
import { CardContent, CardHeader, CardTitle } from "./ui/card";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "atm_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ATM ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
  },
  {
    accessorKey: "response",
    cell: ({ row }) => {
      const response: string | null = row.getValue("response") as string | null;

      return response;
      // <div className="flex items-center gap-2 p-2 rounded-md">
      //   {response === "200" && (
      //     <div className="flex items-center gap-2 bg-green-100 p-1 rounded-md">
      //       <CheckCircle className="text-green-500 w-5 h-5" />
      //       <span className="text-sm font-medium text-green-800">
      //         Approved
      //       </span>
      //     </div>
      //   )}
      //   {response === "120" && (
      //     <div className="flex items-center gap-2 bg-red-100 p-1 rounded-md">
      //       <XCircle className="text-red-500 w-5 h-5" />
      //       <span className="text-sm font-medium text-red-800">Declined</span>
      //     </div>
      //   )}
      //   {response === "121" && (
      //     <div className="flex items-center gap-2 bg-yellow-100 p-1 rounded-md">
      //       <DollarSign className="text-yellow-500 w-5 h-5" />
      //       <span className="text-sm font-medium text-yellow-800">
      //         Insufficient Funds
      //       </span>
      //     </div>
      //   )}
      //   {response === "122" && (
      //     <div className="flex items-center gap-2 bg-purple-100 p-1 rounded-md">
      //       <CreditCard className="text-purple-500 w-5 h-5" />
      //       <span className="text-sm font-medium text-purple-800">
      //         Invalid Card
      //       </span>
      //     </div>
      //   )}
      //   {response === "00" && (
      //     <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
      //       <AlertTriangle className="text-gray-500 w-5 h-5" />
      //       <span className="text-sm font-medium text-gray-800">
      //         Invalid Amount
      //       </span>
      //     </div>
      //   )}
      // </div>
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Response
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "pan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PAN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "transaction_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STAN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "acquirer_channel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Acquirer Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "acquirer_payment_entity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Acquirer Payment Entity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "issuer_channel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Issuer Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "message_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Message Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "pos_entry_mode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          POS Entry Mode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "settlement_date",
    cell: ({ row }) =>
      new Date(row.getValue("settlement_date")).toLocaleDateString(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Settlement Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "payment_company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount_transaction",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_transaction"));
      return amount.toLocaleString();
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "currency_transaction",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Currency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// type ChartDataItem = {
//   count: string;
//   lowCash: number;
//   invalidPin: number;
//   rejectedByIssuer: number;
//   networkFailure: number;
//   timeOut: number;
// };

type ChartDataItem = {
  failures: string;
  reasons: number;
  fill: string;
};

type HorizontalChartDataItem = {
  transaction: string;
  decliners: number;
  fill: string;
};

type AreaChartDataItem = {
  time: string;
  transactions: number;
  amount: number;
};

export function TransactionTable() {
  const { id } = useParams();

  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const [chartData, setChartData] = useState<ChartDataItem[]>([
    { failures: "lowCash", reasons: 0, fill: "var(--color-lowCash)" },
    { failures: "invalidPin", reasons: 0, fill: "var(--color-invalidPin)" },
    {
      failures: "rejectedByIssuer",
      reasons: 0,
      fill: "var(--color-rejectedByIssuer)",
    },
    {
      failures: "networkFailure",
      reasons: 0,
      fill: "var(--color-networkFailure)",
    },
    { failures: "timeOut", reasons: 0, fill: "var(--color-timeOut)" },
  ]);

  const [horizontalChartData, setHorizontalChartData] = useState<
    HorizontalChartDataItem[]
  >([
    { transaction: "member", decliners: 0, fill: "var(--color-member)" },
    { transaction: "network", decliners: 0, fill: "var(--color-network)" },
  ]);

  const [areaChartData, setAreaChartData] = useState<AreaChartDataItem[]>([
    { time: "", transactions: 0, amount: 0 },
  ]);

  const socketRef = useRef<Socket | null>(null);

  const updateTransactionData = (data: unknown) => {
    if (Array.isArray(data) && data.length > 0) {
      const newEntry = data[data.length - 1];
      const entryTime = new Date(newEntry.created_at);
      const timeKey = entryTime.toISOString().split("T")[1].split(".")[0]; // "12:44:00"

      setFilteredData((prevData) => {
        if (id !== undefined) {
          if (newEntry.atm_id === Number(id)) {
            return [...prevData, newEntry];
          }
          return prevData;
        }
        return [...prevData, newEntry];
      });

      // setChartData((prevChartData) => {
      //   if (id !== undefined) {
      //     if (newEntry.atm_id === Number(id)) {
      //       return prevChartData.map((item) => ({
      //         ...item,
      //         lowCash: item.lowCash + (newEntry.failure_reason === 1 ? 1 : 0),
      //         invalidPin:
      //           item.invalidPin + (newEntry.failure_reason === 2 ? 1 : 0),
      //         rejectedByIssuer:
      //           item.rejectedByIssuer + (newEntry.failure_reason === 3 ? 1 : 0),
      //         networkFailure:
      //           item.networkFailure + (newEntry.failure_reason === 4 ? 1 : 0),
      //         timeOut: item.timeOut + (newEntry.failure_reason === 5 ? 1 : 0),
      //       }));
      //     }

      //     return prevChartData;
      //   }
      //   return prevChartData.map((item) => ({
      //     ...item,
      //     lowCash: item.lowCash + (newEntry.failure_reason === 1 ? 1 : 0),
      //     invalidPin: item.invalidPin + (newEntry.failure_reason === 2 ? 1 : 0),
      //     rejectedByIssuer:
      //       item.rejectedByIssuer + (newEntry.failure_reason === 3 ? 1 : 0),
      //     networkFailure:
      //       item.networkFailure + (newEntry.failure_reason === 4 ? 1 : 0),
      //     timeOut: item.timeOut + (newEntry.failure_reason === 5 ? 1 : 0),
      //   }));
      // });

      setChartData((prevChartData) => {
        if (id !== undefined) {
          if (newEntry.atm_id === Number(id)) {
            return prevChartData.map((item) => {
              if (
                item.failures === "lowCash" &&
                newEntry.failure_reason === 1
              ) {
                return { ...item, reasons: item.reasons + 1 };
              }
              if (
                item.failures === "invalidPin" &&
                newEntry.failure_reason === 2
              ) {
                return { ...item, reasons: item.reasons + 1 };
              }
              if (
                item.failures === "rejectedByIssuer" &&
                newEntry.failure_reason === 3
              ) {
                return { ...item, reasons: item.reasons + 1 };
              }
              if (
                item.failures === "networkFailure" &&
                newEntry.failure_reason === 4
              ) {
                return { ...item, reasons: item.reasons + 1 };
              }
              if (
                item.failures === "timeOut" &&
                newEntry.failure_reason === 5
              ) {
                return { ...item, reasons: item.reasons + 1 };
              }
              return item;
            });
          }

          return prevChartData;
        }

        return prevChartData.map((item) => {
          if (item.failures === "lowCash" && newEntry.failure_reason === 1) {
            return { ...item, reasons: item.reasons + 1 };
          }
          if (item.failures === "invalidPin" && newEntry.failure_reason === 2) {
            return { ...item, reasons: item.reasons + 1 };
          }
          if (
            item.failures === "rejectedByIssuer" &&
            newEntry.failure_reason === 3
          ) {
            return { ...item, reasons: item.reasons + 1 };
          }
          if (
            item.failures === "networkFailure" &&
            newEntry.failure_reason === 4
          ) {
            return { ...item, reasons: item.reasons + 1 };
          }
          if (item.failures === "timeOut" && newEntry.failure_reason === 5) {
            return { ...item, reasons: item.reasons + 1 };
          }
          return item;
        });
      });

      setHorizontalChartData((prevChartData) => {
        if (id !== undefined) {
          if (newEntry.atm_id === Number(id)) {
            return prevChartData.map((item) => {
              if (item.transaction === "member" && newEntry.member_decliner) {
                return { ...item, decliners: item.decliners + 1 };
              }
              if (item.transaction === "network" && !newEntry.member_decliner) {
                return { ...item, decliners: item.decliners + 1 };
              }
              return item;
            });
          }

          return prevChartData;
        }

        return prevChartData.map((item) => {
          if (item.transaction === "member" && newEntry.member_decliner) {
            return { ...item, decliners: item.decliners + 1 };
          }
          if (item.transaction === "network" && !newEntry.member_decliner) {
            return { ...item, decliners: item.decliners + 1 };
          }
          return item;
        });
      });

      setAreaChartData((prevChartData) => {
        if (id !== undefined) {
          if (newEntry.atm_id === Number(id)) {
            const existingTimeSlot = prevChartData.find(
              (item) => item.time === timeKey
            );

            if (existingTimeSlot) {
              return prevChartData.map((item) =>
                item.time === timeKey
                  ? {
                      ...item,
                      transactions: item.transactions + 1,
                      amount: item.amount + newEntry.amount_transaction,
                    }
                  : item
              );
            } else {
              return [
                ...prevChartData,
                {
                  time: timeKey,
                  transactions: 1,
                  amount: newEntry.amount_transaction,
                },
              ];
            }
          }

          return prevChartData;
        }

        const existingTimeSlot = prevChartData.find(
          (item) => item.time === timeKey
        );

        if (existingTimeSlot) {
          return prevChartData.map((item) =>
            item.time === timeKey
              ? {
                  ...item,
                  transactions: item.transactions + 1,
                  amount: item.amount + newEntry.amount_transaction,
                }
              : item
          );
        } else {
          return [
            ...prevChartData,
            {
              time: timeKey,
              transactions: 1,
              amount: newEntry.amount_transaction,
            },
          ];
        }
      });
    }
  };

  console.log("Chart Data", chartData);

  const fetchData = async () => {
    try {
      let query = supabase
        .from("TransactionData")
        .select("*")
        .order("created_at", { ascending: true });

      if (id !== undefined) {
        query = query.eq("atm_id", Number(id));
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }
      // Update the response property to "Approved" in every object
      const updatedData = (data || []).map((item) => ({
        ...item,
        response: Math.random() > 0.5 ? "Approved" : "Rejected",
      }));

      // Set the updated data to the filtered data state
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    socketRef.current = io("http://localhost:3000");
    const handleUpdateTable = (data: unknown) => {
      updateTransactionData(data);
    };

    socketRef.current.on("updateTable", handleUpdateTable);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("updateTable", handleUpdateTable);
      }
    };
  }, []);

  useEffect(() => {
    if (filteredData.length > 0) {
      const lastIndex = filteredData.length - 1;
      const updateState = async () => {
        if (filteredData[lastIndex].response === "00") {
          setFilteredData((prev) => {
            const updatedData = prev.map((item, index) =>
              index === lastIndex ? { ...item, response: "Received" } : item
            );
            return updatedData;
          });

          await new Promise((resolve) => setTimeout(resolve, 3000));
          setFilteredData((prev) => {
            const updatedData = prev.map((item, index) =>
              index === lastIndex ? { ...item, response: "In Progress" } : item
            );
            return updatedData;
          });

          await new Promise((resolve) => setTimeout(resolve, 3000));
          setFilteredData((prev) => {
            const updatedData = prev.map((item, index) =>
              index === lastIndex
                ? {
                    ...item,
                    response: Math.random() > 0.5 ? "Approved" : "Rejected",
                  }
                : item
            );
            return updatedData;
          });
        }
      };

      updateState();
    }
  }, [filteredData.length]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: { pageSize: 50 }, // Set initial page size to 50
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex gap-[20px]">
        {/* <div className="w-1/3">
          <StackedBarGraph />
        </div> */}
        <div className="w-1/2">
          <BarGraph chartData={chartData} />
        </div>
        <div className="w-1/2">
          <HorizontalGraph horizontalChartData={horizontalChartData} />
        </div>
      </div>
      <div className="mt-4">
        <AreaGraph areaChartData={areaChartData} />
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={
            (table.getColumn("transaction_type")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("transaction_type")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Drawer>
          <DrawerTrigger className="mt-3" asChild>
            <Button
              className="w-[36px] h-[36px] mt-0 ml-[10px]"
              variant="outline"
            >
              <Maximize />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="h-full">
            <CardHeader className="relative">
              <div className="flex items-center py-4">
                <CardTitle>Transaction Lists</CardTitle>
                <Input
                  placeholder="Search..."
                  value={
                    (table
                      .getColumn("transaction_type")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("transaction_type")
                      ?.setFilterValue(event.target.value)
                  }
                  className="ml-10 max-w-sm"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border h-[70vh] overflow-auto">
                <Table className="min-w-full table-auto bg-gray-50 border-collapse">
                  <TableHeader className="bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-b border-gray-300"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="py-3 px-4 text-left text-sm font-semibold text-white"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody className="bg-gray-50">
                    <AnimatePresence>
                      {table.getRowModel().rows?.length ? (
                        [...table.getRowModel().rows].reverse().map((row) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8 }}
                            data-state={row.getIsSelected() && "selected"}
                            className="border-b border-gray-300 hover:bg-blue-50"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="py-3 px-4 text-sm text-gray-700"
                              >
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
              <div className="flex items-center space-x-6 lg:space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            </CardContent>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="rounded-md border">
        <Table className="min-w-full table-auto bg-gray-50 border-collapse">
          <TableHeader className="bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-300"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 px-4 text-left text-sm font-semibold text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="bg-gray-50">
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                [...table.getRowModel().rows].reverse().map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-300 hover:bg-blue-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 px-4 text-sm text-gray-700"
                      >
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
      <div className="flex items-center space-x-6 lg:space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[50, 100, 150, 200].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
