import { Server } from "socket.io";
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL = "https://ajfgwfendpumnrsztmuz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZmd3ZmVuZHB1bW5yc3p0bXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMjU5NjEsImV4cCI6MjA1MTgwMTk2MX0.GhIWCzBqkRhpQffbJ0ZYhHCKAcoQIj-zxP2WX3Ixf6c";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Allow requests from localhost:3001
    methods: ["GET", "POST"],
  },
});

// Function to fetch data from Supabase
async function fetchTransactionData() {
  const { data, error } = await supabase
    .from("TransactionData")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return [];
  }
  return data;
}

let placeholder_data = [
  {
    transaction_type: [
      "Send Money",
      "Cash In",
      "Cash Out",
      "Purchase",
      "Withdrawal",
      "Deposit",
      "Refund",
      "Reversal",
      "Chargeback",
      "Fees",
      "Interest",
      "Others",
    ],
    acquirer_payment_entity: [
      "Visa",
      "Mastercard",
      "American Express",
      "Discover",
      "Others",
    ],
    issuer_channel: ["ATM"],
    product: ["ProductA", "ProductB", "ProductC", "ProductD", "Others"],
    message_type: ["0200", "0300", "0400", "0800"],
    pos_entry_mode: ["Magnetic", "Chip", "Contactless", "Others"],
    response: [
      "200", //Approved
      "120", //Declined
      "121", //Insufficient funds
      "122", //Invalid card
      "00", //Invalid amount
    ],
    payment_company: ["CompanyA", "CompanyB", "CompanyC", "CompanyD"],
    acquirer_channel: ["ATM", "POS", "Web", "Mobile"],
    member_transaction: [false, true],
    member_decliner: [false, true],
    atm_id: [2910, 2930, 2950, 2970, 2971],
    failure_reason: [1, 2, 3, 4, 5],
  },
];

// Function to insert data into Supabase
async function insertTransactionData() {
  const { error } = await supabase.from("TransactionData").insert([
    {
      id: Math.floor(100 + Math.random() * 900).toString(),
      atm_id:
        placeholder_data[0].atm_id[
          Math.floor(Math.random() * placeholder_data[0].atm_id.length)
        ],
      created_at: new Date().toISOString(),
      pan: "1234567890123456",
      transaction_type:
        placeholder_data[0].transaction_type[
          Math.floor(
            Math.random() * placeholder_data[0].transaction_type.length
          )
        ],
      stan: Math.floor(Math.random() * 100000).toString(), // Random STAN
      acquirer_channel:
        placeholder_data[0].acquirer_channel[
          Math.floor(
            Math.random() * placeholder_data[0].acquirer_channel.length
          )
        ],
      acquirer_payment_entity:
        placeholder_data[0].acquirer_payment_entity[
          Math.floor(
            Math.random() * placeholder_data[0].acquirer_payment_entity.length
          )
        ],
      issuer_channel:
        placeholder_data[0].issuer_channel[
          Math.floor(Math.random() * placeholder_data[0].issuer_channel.length)
        ],
      product:
        placeholder_data[0].product[
          Math.floor(Math.random() * placeholder_data[0].product.length)
        ],
      message_type:
        placeholder_data[0].message_type[
          Math.floor(Math.random() * placeholder_data[0].message_type.length)
        ],
      pos_entry_mode:
        placeholder_data[0].pos_entry_mode[
          Math.floor(Math.random() * placeholder_data[0].pos_entry_mode.length)
        ],
      response: "00",
      settlement_date: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString(), // Tomorrow's date
      payment_company:
        placeholder_data[0].payment_company[
          Math.floor(Math.random() * placeholder_data[0].payment_company.length)
        ],
      actions: true,
      amount_transaction: Math.floor(
        Math.random() * (1000000 - 100000) + 100000
      ),
      currency_transaction: "PKR",
      member_transaction:
        placeholder_data[0].member_transaction[
          Math.floor(
            Math.random() * placeholder_data[0].member_transaction.length
          )
        ],
      member_decliner:
        placeholder_data[0].member_decliner[
          Math.floor(Math.random() * placeholder_data[0].member_decliner.length)
        ],
      failure_reason:
        placeholder_data[0].failure_reason[
          Math.floor(Math.random() * placeholder_data[0].failure_reason.length)
        ],
    },
  ]);

  if (error) {
    console.error("Error inserting data into Supabase:", error);
  } else {
    console.log("Data inserted successfully");
  }
}

supabase
  .channel("transaction-data")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "TransactionData" },
    async (payload) => {
      console.log("Change detected:", payload);
      const updatedData = await fetchTransactionData();
      io.emit("updateTable", updatedData);
    }
  )
  .subscribe();

setInterval(
  insertTransactionData,
  Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000
);

io.on("connection", async (socket) => {
  console.log("Client connected");

  // Send initial data
  const initialData = await fetchTransactionData();
  socket.emit("updateTable", initialData);

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
