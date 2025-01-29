"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function PBITable() {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Dummy data based on the new columns
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
    // Add more dummy data entries as needed
  ];

  React.useEffect(() => {
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
    <Card className="">
      {/* <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Task Table</h2>
        </div>
      </CardHeader> */}
      <CardContent className="m-0 p-3">
        <div>
          <div className="rounded-md">
            <Table className="m-0 ">
              <TableHeader className="bg-gray-100 uppercase ">
                <TableRow className="border-none ">
                  <TableHead className="w-[50px] rounded-tl-xl rounded-bl-xl">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Assigned To
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Created By
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
                  <TableHead className="font-bold text-gray-700">
                    Severity
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Created At
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    State
                  </TableHead>
                  <TableHead className="rounded-br-xl rounded-tr-xl text-gray-700">
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
                      <TableCell className="flex items-center gap-1">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-full">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        {row.assignedTo}
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-full">
                            AS
                          </AvatarFallback>
                        </Avatar>
                        {row.createdBy}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.tSize}</TableCell>
                      <TableCell>{row.severity}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>{row.state}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Heart /> {row.like}
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
        </div>
      </CardContent>
    </Card>
  );
}
