import { useEffect, useState } from "react";
import { ATMCassette } from "./atm-cassette";

interface CassetteData {
  id: number;
  denomination: string;
  notesReplenished: number;
  notesRecycled: number;
  notesWithdrawn: number;
  notesRemaining: number;
  notesRejected: number;
}

export function ATMCassettes() {
  const [cassettesData, setCassettesData] = useState<CassetteData[]>([
    {
      id: 1,
      denomination: "5000 PKR",
      notesReplenished: 1000,
      notesRecycled: 200,
      notesWithdrawn: 500,
      notesRemaining: 700,
      notesRejected: 5,
    },
    {
      id: 2,
      denomination: "1000 PKR",
      notesReplenished: 2000,
      notesRecycled: 300,
      notesWithdrawn: 800,
      notesRemaining: 1500,
      notesRejected: 10,
    },
    {
      id: 3,
      denomination: "500 PKR",
      notesReplenished: 5000,
      notesRecycled: 1000,
      notesWithdrawn: 2000,
      notesRemaining: 4000,
      notesRejected: 20,
    },
    {
      id: 4,
      denomination: "100 PKR",
      notesReplenished: 10000,
      notesRecycled: 2000,
      notesWithdrawn: 5000,
      notesRemaining: 7000,
      notesRejected: 30,
    },
  ]);

  useEffect(() => {
    const eventSource = new EventSource("/api/cassette");

    eventSource.onmessage = (event) => {
      const updatedCassette = JSON.parse(event.data) as CassetteData;

      // Check if there are any changes and only update the specific cassette that changed
      setCassettesData((prev) =>
        prev.map((cassette) =>
          cassette.id === updatedCassette.id
            ? { ...cassette, ...updatedCassette }
            : cassette
        )
      );
    };

    eventSource.onerror = () => {
      console.error("Error connecting to SSE");
      eventSource.close();
    };

    // Clean up on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cassettesData.map((cassette) => (
        <ATMCassette key={cassette.id} data={cassette} />
      ))}
    </div>
  );
}
