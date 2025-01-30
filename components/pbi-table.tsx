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
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input"

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
  SelectTrigger
} from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function PBITable() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState("bottom");
  const [selectedValue, setSelectedValue] = useState("10");
  const itemsPerPage = 10;

  const dummyData = [
    {
      assignedTo: "John Doe",
      createdBy: "Alice Smith",
      name: "Task 1",
      description: "Description of Task 1",
      tSize: "Small",
      severity: "Low",
      createdAt: "2025-01-29",
      state: "Pending",
      like: 5,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 2",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 10,
    },
    {
      assignedTo: "John Doe",
      createdBy: "Alice Smith",
      name: "Task 3",
      description: "Description of Task 1",
      tSize: "Small",
      severity: "Low",
      createdAt: "2025-01-29",
      state: "Pending",
      like: 15,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
    {
      assignedTo: "Jane Doe",
      createdBy: "Bob Johnson",
      name: "Task 4",
      description: "Description of Task 2",
      tSize: "Medium",
      severity: "High",
      createdAt: "2025-01-28",
      state: "Active",
      like: 20,
    },
  ];

  useEffect(() => {
    setTableData(dummyData);
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

  return (
    <>
      <div className="w-full flex justify-between mb-3 px-1">
        <div>
          {/* <Input placeholder="Search..." /> */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Products</SelectLabel>
                <SelectItem value="apple">Digital Banking</SelectItem>
                <SelectItem value="banana">Mobile Money</SelectItem>
                <SelectItem value="blueberry">Sparrow</SelectItem>
                <SelectItem value="grapes">Bill Payments</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent className="m-0 p-3">
          <div>
            <div className="border-b-2 border-gray-200">
              <Table className="m-0 ">
                <TableHeader className="bg-gray-100 uppercase ">
                  <TableRow className="border-none ">
                    <TableHead className="w-[50px] rounded-tl-lg rounded-bl-lg">
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length}
                        onCheckedChange={toggleAllRows}
                      />
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">
                      Name
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">
                      Description
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">
                      T-size
                    </TableHead>
                    <TableHead className="font-bold rounded-br-lg rounded-tr-lg text-gray-700">
                      Like
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedData.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border-b"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(String(index))}
                            onCheckedChange={() =>
                              toggleRowSelection(String(index))
                            }
                          />
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.tSize}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Heart /> {row.like}
                        </TableCell>
                      </motion.tr>
                    ))}
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
