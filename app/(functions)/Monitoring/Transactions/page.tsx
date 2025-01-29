import { TransactionTable } from "@/components/transaction-table";

export default function Home() {
  return (
    <div className="p-4 overflow-auto w-full">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>

      <div className="overflow-auto">
        <TransactionTable />
      </div>
    </div>
  );
}
