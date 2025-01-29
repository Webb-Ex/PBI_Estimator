import { NextResponse } from "next/server";

interface CassetteData {
  id: number;
  denomination: string;
  notesReplenished: number;
  notesRecycled: number;
  notesWithdrawn: number;
  notesRemaining: number;
  notesRejected: number;
}

const mockData: CassetteData[] = [
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
];

export async function GET() {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      while (true) {
        const cassetteIndex = Math.floor(Math.random() * mockData.length);
        const cassette = { ...mockData[cassetteIndex] };

        const keys: (keyof Omit<CassetteData, "id" | "denomination">)[] = [
          "notesReplenished",
          "notesRecycled",
          "notesWithdrawn",
          "notesRemaining",
          "notesRejected",
        ];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        
        cassette[randomKey] = Math.max(
          0,
          cassette[randomKey] + Math.floor(Math.random() * 100) - 50
        );
        

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(cassette)}\n\n`)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
