import { supabase } from "@/lib/supabaseClient";

let intervalId: NodeJS.Timeout | null = null;

const updateFields = async () => {
  const { data, error } = await supabase.from("ATMs").select("*");

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  if (data) {
    for (const record of data) {
      const updatedFields: any = {};

      if (record.ConfigLoadStatus < 100) {
        updatedFields.ConfigLoadStatus = Math.min(
          record.ConfigLoadStatus + Math.floor(Math.random() * 10 + 1),
          100
        );
        updatedFields.CommsStatus = updatedFields.ConfigLoadStatus === 100 ? "Up" : "Down";
        updatedFields.State = updatedFields.ConfigLoadStatus === 100 ? "In Service" : "Pending";
      }

      if (Object.keys(updatedFields).length > 0) {
        const { data: updatedData, error: updateError } = await supabase
          .from("ATMs")
          .update(updatedFields)
          .eq("Id", record.Id);
      
        if (updateError) {
          console.error("Error updating record:", updateError.message);
        } else {
          console.log(`Updated record with id ${record.Id}:`, updatedData);
        }
      }
    }
  }
};

const initializeFields = async () => {
    const { error } = await supabase
      .from("ATMs")
      .update({
        ConfigLoadStatus: "0",
        CommsStatus: "Down",
        State: "Pending",
      })
      .neq("Id", null);
  
    if (error) {
      console.error("Error initializing records:", error.message);
    } else {
      console.log("All records initialized.");
    }
  };

export const startService = async () => {
  if (!intervalId) {

    // Initialize fields only once when the service starts
    await initializeFields();

    intervalId = setInterval(updateFields, 10000); 
    console.log("ATM update service started.");
  }
};

export const stopService = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("ATM update service stopped.");
  }
};
