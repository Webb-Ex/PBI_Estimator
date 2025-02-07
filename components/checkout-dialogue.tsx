import { type Row } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDot, Clock, ExternalLink, ListChecks } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SIZE_MAPPING, TSIZE_DAYS, TSizeBadge } from "./pbi-table";
import { supabase } from "@/lib/supabaseClient";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CheckoutDialogProps {
  selectedRow?: Row<any>[];
  tableData?: any[];
  pbi_ids?: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "checkout" | "view";
}

interface Checkout {
  id: string;
  user_id: string;
  pbi_ids: string[];
  status: "pending" | "completed" | "cancelled";
  created_at: string;
}

const handleCheckout = async (selectedRows: Row<any>[], userId: string) => {
  try {
    // Extract PBI IDs from selected rows
    const pbiIds = selectedRows.map((row) => row.original.id);

    if (pbiIds.length === 0) {
      throw new Error("No PBIs selected for checkout");
    }

    // Insert checkout record
    const { data, error } = await supabase
      .from("checkout")
      .insert({
        user_id: userId,
        pbi_ids: pbiIds,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log("Checkout created:", data);
    return data as Checkout;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return null;
  }
};

export function CheckoutDialog({
  selectedRow,
  tableData,
  pbi_ids,
  isOpen,
  onOpenChange,
  mode,
}: CheckoutDialogProps) {
  const calculateMetrics = (selectedRows: Row<any>[]) => {
    const totalFeatures = selectedRows.length;
    const totalTSizeDays = selectedRows.reduce((total, row) => {
      const dbSize = (
        row.getValue("t_size") as string
      )?.toLowerCase() as keyof typeof SIZE_MAPPING;
      if (!dbSize || !SIZE_MAPPING[dbSize]) return total;
      const mappedSize = SIZE_MAPPING[dbSize];
      return total + TSIZE_DAYS[mappedSize];
    }, 0);
    return { totalFeatures, totalTSizeDays };
  };

  const [viewData, setViewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchPBIDetails = async (ids: string[]) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("PBI")
        .select("*")
        .in("id", ids);

      if (error) throw error;
      setViewData(data);
    } catch (error) {
      console.error("Error fetching PBI details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "view" && pbi_ids && isOpen) {
      fetchPBIDetails(pbi_ids);
    }
  }, [pbi_ids, isOpen, mode]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {mode === "checkout"
            ? "Checkout Selected PBIs"
            : "View Checkout Details"}
          <DialogDescription>
            Review and confirm your selection
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Selected Features
              </CardTitle>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {calculateMetrics(selectedRow).totalFeatures}
                </div>
                <Badge variant="secondary" className="mt-2">
                  <CircleDot className="h-3 w-3 mr-1" />
                  {selectedRow.length} of {tableData.length} items
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                <div className="">Total Effort</div>

                <div className="">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Link
                            target="_blank"
                            href="https://efforts.tpsonline.com/Product/QuotationList"
                          >
                            <ExternalLink className="h-4 w-4 text-gray-900" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Effort Estimation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardTitle>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {calculateMetrics(selectedRow).totalTSizeDays}
                  <span className="text-sm ml-1 text-muted-foreground">
                    days
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  <Clock className="h-3 w-3 mr-1" />~
                  {Math.ceil(calculateMetrics(selectedRow).totalTSizeDays / 30)}{" "}
                  months
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>T-Size</TableHead>
                <TableHead>Effort</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(selectedRow || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.getValue("name")}</TableCell>
                  <TableCell>{row.getValue("description")}</TableCell>
                  <TableCell>
                    <TSizeBadge size={row.getValue("t_size")} />
                  </TableCell>
                  <TableCell>
                    {
                      TSIZE_DAYS[
                        SIZE_MAPPING[
                          (
                            row.getValue("t_size") as string
                          ).toLowerCase() as keyof typeof SIZE_MAPPING
                        ]
                      ]
                    }{" "}
                    days
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                const userId = "f7ab4717-efdc-4579-a73a-5c2416d49ce3";
                const checkout = await handleCheckout(selectedRow, userId);

                if (checkout) {
                  toast.success("Checkout Complete", {
                    description: `Successfully checked out ${selectedRow.length} items`,
                    action: {
                      label: "View Details",
                      onClick: () => router.push("/Checkouts"),
                    },
                    duration: 5000,
                  });
                  onOpenChange(false);
                }
              } catch (error) {
                toast.error("Checkout Failed", {
                  description: "There was an error processing your request",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={selectedRow.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Checkout (${selectedRow.length})`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
