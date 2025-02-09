import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ListChecks, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "./ui/skeleton";
import { TSIZE_DAYS } from "@/constants/constants";


interface CheckoutDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    checkoutId: string;
    totalEffort: number;
}

export function CheckoutDetailsDialog({
    isOpen,
    onOpenChange,
    checkoutId,
    totalEffort
}: CheckoutDetailsDialogProps) {
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDetails = async () => {
        if (!isOpen) return;

        setIsLoading(true);
        try {
            const { data: checkout } = await supabase
                .from("checkout")
                .select(`
          *,
          users:user_id (email)
        `)
                .eq('id', checkoutId)
                .single();

            const { data: pbis } = await supabase
                .from("PBI")
                .select('*')
                .in('id', checkout.pbi_ids);

            setDetails({ ...checkout, pbis });
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [isOpen, checkoutId]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Checkout Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-48" />
                    </div>
                ) : details && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {details.users.email}
                            </span>
                            <Badge variant={
                                details.status === "completed" ? "up" :
                                    details.status === "cancelled" ? "destructive" : "default"
                            }>
                                {details.status}
                            </Badge>
                        </div>

                        {/* Metrics Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="flex items-center gap-2 p-4">
                                    <ListChecks className="h-4 w-4 text-violet-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total PBIs</p>
                                        <p className="text-lg font-semibold">{details.pbis.length}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center gap-2 p-4">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Effort</p>
                                        <p className="text-lg font-semibold">
                                            {totalEffort} days days
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center gap-2 p-4">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created</p>
                                        <p className="text-lg font-semibold">
                                            {new Date(details.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* PBIs Table */}
                        <div className="relative rounded-md border max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[200px]">Name</TableHead>
                                        <TableHead className="max-w-[500px]">Description</TableHead>
                                        <TableHead className="w-[100px]">T-Size</TableHead>
                                        <TableHead className="w-[150px]">Product</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {details.pbis.map((pbi: any, index: number) => (
                                            <motion.tr
                                                key={pbi.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">{pbi.name}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {pbi.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-mono"
                                                    >
                                                        {pbi.t_size}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {pbi.product}
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
}