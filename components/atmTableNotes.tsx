import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "./ui/badge";
import { Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import for animations

interface AtmTableNotesProps {
  atmId: number;
}

const AtmTableNotes: React.FC<AtmTableNotesProps> = ({ atmId }) => {
  const [cassetteData, setCassetteData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [updatedItemId, setUpdatedItemId] = useState<number | null>(null);

  // Simulate update by watching cassetteData for changes
  useEffect(() => {
    // Example logic to detect an update (adjust based on your actual update mechanism)
    if (cassetteData.length > 0) {
      const updatedItem = cassetteData.find((item) => item.isUpdated);
      if (updatedItem) {
        setUpdatedItemId(updatedItem.id);
        setTimeout(() => setUpdatedItemId(null), 1000); // Reset after animation
      }
    }
  }, [cassetteData]);

  // Function to fetch the data initially
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("CassetteData")
        .select("*")
        .eq("atm_id", atmId);

      if (error) throw error;

      setCassetteData(data);
      setIsDataFetched(true); // Mark data as fetched
      console.log("Data fetched for ATM ID:", atmId, cassetteData);
    } catch (error) {
      console.error("Error fetching cassette data:", (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching data for ATM ID:", atmId);

    fetchData();

    const channel = supabase
      .channel(`public:CassetteData:${atmId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "CassetteData" },
        (payload) => {
          console.log("PayloadPayload", payload, atmId);

          if (payload.new && payload.new.atm_id === atmId) {
            setCassetteData((prevData) =>
              prevData.map((item) =>
                item.atm_id === payload.new.atm_id && item.id === payload.new.id
                  ? { ...item, ...payload.new }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [atmId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-wrap">
      {cassetteData.map((item) => (
        <motion.div
          key={`${item.id}-${item.notesRemaining}`}
          className="m-1 rounded-md border"
          animate={{
            y: [0, -7, 0],
            backgroundColor: ["#FFF", "#6ee7b7", "#FFF"],
          }}
          transition={{
            duration: 0.7,
            ease: "easeIn",
          }}
        >
          <Badge variant="outline" className="w-36 border-transparent">
            <Banknote className="w-4 me-1 text-green-700 pb-0" />
            <p className="text-nowrap">
              {item.denomination} : {item.notesRemaining}
            </p>
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};

export default AtmTableNotes;
