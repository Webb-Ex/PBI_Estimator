"use client";

import { TransactionTable } from "@/components/transaction-table";
import { useParams } from "next/navigation";

const page = () => {
  const { id } = useParams(); // This will give you the dynamic ATM ID

  return (
    <div className="p-4 overflow-auto w-full">
      <h1 className="text-xl font-bold mb-4">Transactions for ATM {id}</h1>

      <div className="overflow-auto">
        <TransactionTable />
      </div>
    </div>
  );
};

export default page;
