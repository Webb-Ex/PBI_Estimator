"use client";

import * as React from "react";
import {
  MoreHorizontal,
  FilePenLine,
  Zap,
  OctagonMinus,
  SquareMenu,
  FileText,
  ListCheck,
  BadgeCheck,
  OctagonX,
  Trash2,
  TrashIcon,
  Download,
  Power,
  CalendarClock,
  FileChartColumn,
  CirclePlus,
  Search,
  Play,
  CircleStop,
  Info,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ATMTableSkeleton } from "./skeletons/atm-table-skeleton";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import ATMDetailsDrawer from "./atm-detail-drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import AtmTableHoverCard from "./atmTableNotes";
import { Separator } from "./ui/separator";
import AtmTableNotes from "./atmTableNotes";
import { MultiSegmentProgress } from "./customProgressBar";
import { DeviceStatusProgress } from "./deviceStatusProgress";

export default function ATMTable() {
  const [atmData, setAtmData] = React.useState<any[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const itemsPerPage = 10;
  const socketRef = React.useRef<any>(null);

  const handleOpenDrawer = (id: number) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedId(null);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("ATMs").select("*");

      if (error) {
        throw new Error(error.message);
      }

      setAtmData(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    console.log("Fetching data...");

    fetchData();

    const channel = supabase
      .channel("public:ATMs")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ATMs" },
        (payload) => {
          // Handle the real-time update
          console.log("Update payload:", payload);

          setAtmData((prevData) =>
            prevData.map((atm) =>
              atm.Id === payload.new.Id ? payload.new : atm
            )
          );
        }
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const totalPages = Math.ceil(atmData.length / itemsPerPage);
  const paginatedData = atmData.slice(
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
      prev.length === atmData.length ? [] : atmData.map((row) => row.Id)
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "down":
        return "destructive";
      case "up":
        return "up";
      default:
        return "secondary";
    }
  };

  const getStateVariant = (state: string) => {
    switch (state.toLowerCase()) {
      case "pending":
        return "pending";
      case "active":
        return "default";
      case "in service":
        return "inservice";
      default:
        return "secondary";
    }
  };

  const startService = async (): Promise<void> => {
    try {
      const response: Response = await fetch("/api/atmService", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start the service.");
      }

      console.log("Service started.");
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const stopService = async (): Promise<void> => {
    try {
      const response: Response = await fetch("/api/atmService", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to stop the service.");
      }

      console.log("Service stopped.");
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  if (isLoading) {
    return <ATMTableSkeleton />;
  }

  const deviceStatusData = [
    {
      value: 7, 
      label: "Pending Devices",
    },
    {
      value: 12, 
      label: "Normal Devices",
    },
    {
      value: 0, 
      label: "Warning Devices",
    },
    {
      value: 0, 
      label: "Critical Devices",
    },
  ];
  

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="">
          <h2 className="text-xl">ATM Profiles</h2>
        </div>
        <div className="flex gap-2">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <Zap className="w-4 text-end me-2 " />
                Actions
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>
                    <FilePenLine className="w-4 text-end me-2" />
                    Change Log Type
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <OctagonMinus className="w-4 text-end me-2 text-red-600" />{" "}
                      Disable Logs
                    </MenubarItem>
                    <MenubarItem>
                      <SquareMenu className="w-4 text-end me-2 text-green-600" />{" "}
                      Log Type Information
                    </MenubarItem>
                    <MenubarItem>
                      <FileText className="w-4 text-end me-2 text-blue-600" />{" "}
                      Log Type Verbose
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarSub>
                  <MenubarSubTrigger>
                    <ListCheck className="w-4 text-end me-2" />
                    Change Status
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <BadgeCheck className="w-4 text-end me-2 text-green-600" />{" "}
                      Mark Operational
                    </MenubarItem>
                    <MenubarItem>
                      <OctagonX className="w-4 text-end me-2 text-red-600" />{" "}
                      Mark Non-Operational
                    </MenubarItem>
                    <MenubarItem>
                      <TrashIcon className="w-4 text-end me-2 text-green-600" />{" "}
                      Undo Soft Delete
                    </MenubarItem>
                    <MenubarItem>
                      <Trash2 className="w-4 text-end me-2 text-red-600" /> Soft
                      Delete
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarItem>
                  <Download className="w-4 text-end me-2 " /> Load Settings
                </MenubarItem>
                <MenubarItem>
                  <Power className="w-4 text-end me-2 " /> Change State
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon">
                  <CalendarClock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule Downtime</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon">
                  <FileChartColumn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Transactions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon">
                  <CirclePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={startService}>
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start Service</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={stopService}>
                  <CircleStop className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop Service</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === paginatedData.length}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>ATM Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Configuration</TableHead>
              <TableHead>Comms / Status</TableHead>
              <TableHead>Notes Remaining</TableHead>
              <TableHead>Load Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedData.map((row) => (
                <motion.tr
                  key={row.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.Id)}
                      onCheckedChange={() => toggleRowSelection(row.Id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">ID: {row.DisplayId}</div>
                    <div className="text-sm text-muted-foreground">
                      Terminal: {row.TerminalId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      IP: {row.IpAddress}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{row.Location}</div>
                    <div className="text-sm text-muted-foreground">
                      {row.City}, {row.Region}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Branch: {row.BranchCode} ({row.IsOffsite})
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Group: {row.ConfigurationGroup}</div>
                    <div className="text-sm text-muted-foreground">
                      Process: {row.ProcessGroup}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      TLS: {row.TLSEnabled}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Make: {row.Make}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(row.CommsStatus)}
                      className="mb-1 me-1"
                    >
                      {row.CommsStatus}
                    </Badge>
                    <Badge variant={getStateVariant(row.State)}>
                      {row.State}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-auto max-w-80">
                    <AtmTableNotes atmId={row.Id} />
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {row.ConfigLoadStatus < 100 ? (
                        <>
                          <div className="flex items-center gap-1">
                            <MultiSegmentProgress
                              className="w-[60px]"
                              segments={[
                                {
                                  value: row.ConfigLoadStatus,
                                  color: "bg-green-500",
                                },
                              ]}
                            />
                            <div className="text-sm text-muted-foreground">
                              {row.ConfigLoadStatus}%
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {row.ConfigLoadStatus == 100
                              ? "Loaded"
                              : "Loading..."}
                          </div>
                        </>
                      ) : (
                        <>
                          <DeviceStatusProgress segments={deviceStatusData} />
                          <div>Devices Status</div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOpenDrawer(row.Id)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/Monitoring/Transactions/${row.Id}`}>
                            View Transactions
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
        >
          Next
        </Button>
      </div>
      <ATMDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        //@ts-ignore
        id={selectedId}
      />
    </div>
  );
}
