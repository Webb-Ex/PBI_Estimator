// app/api/atmService/route.ts

import { startService, stopService } from "@/services/updateATMService";

// Export the POST handler
export async function POST(req: Request) {
  console.log("Starting ATM service...");
  startService();
  
  return new Response(JSON.stringify({ message: "ATM update service started." }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Export the DELETE handler
export async function DELETE(req: Request) {
  console.log("Stopping ATM service...");
  stopService();
  
  return new Response(JSON.stringify({ message: "ATM update service stopped." }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
