import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Banknote, RefreshCw, ArrowDownToLine, Package, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator"; 
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CassetteData {
  id: number;
  denomination: string;
  notesReplenished: number;
  notesRecycled: number;
  notesWithdrawn: number;
  notesRemaining: number;
  notesRejected: number;
}

interface ATMCassetteProps {
  data: CassetteData;
}

interface CassetteData {
  id: number;
  denomination: string;
  notesReplenished: number;
  notesRecycled: number;
  notesWithdrawn: number;
  notesRemaining: number;
  notesRejected: number;
}

interface ATMCassetteProps {
  data: CassetteData;
}

export function ATMCassette({ data }: ATMCassetteProps) {
  const [previousData, setPreviousData] = useState<CassetteData>(data);
  const [changedItems, setChangedItems] = useState<{ [key: string]: boolean }>({});
  const [itemDirection, setItemDirection] = useState<{ [key: string]: 'increase' | 'decrease' }>({});

  const items = [
    {
      label: "Notes Replenished",
      value: data.notesReplenished,
      icon: Banknote,
      key: "notesReplenished",
    },
    { label: "Notes Recycled", value: data.notesRecycled, icon: RefreshCw, key: "notesRecycled" },
    {
      label: "Notes Withdrawn",
      value: data.notesWithdrawn,
      icon: ArrowDownToLine,
      key: "notesWithdrawn",
    },
    { label: "Notes Remaining", value: data.notesRemaining, icon: Package, key: "notesRemaining" },
    { label: "Notes Rejected", value: data.notesRejected, icon: XCircle, key: "notesRejected" },
  ];

  useEffect(() => {
    const changed: { [key: string]: boolean } = {};
    const direction: { [key: string]: 'increase' | 'decrease' } = {};

    items.forEach((item) => {
      const key = item.key as keyof CassetteData;
      if (previousData[key] !== data[key]) {
        changed[key] = true;
        direction[key] = data[key] > previousData[key] ? 'increase' : 'decrease';
      }
    });

    setChangedItems(changed);
    setItemDirection(direction);
    setPreviousData(data);
  }, [data]);

  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Cassette {data.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{data.denomination}</div>
          <div className="grid gap-4">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={changedItems[item.key] ? { opacity: 1, scale: 1 } : { opacity: 0.7 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  {/* Animate icon with color change */}
                  <motion.div
                    className="h-5 w-5 mr-2 block"
                    animate={{
                      opacity: changedItems[item.key] ? 1 : 0.7,
                      scale: changedItems[item.key] ? 1.1  : 1,
                      color: itemDirection[item.key] === 'increase' ? 'green' : itemDirection[item.key] === 'decrease' ? 'red' : 'black',
                    }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                    }}
                    onAnimationComplete={() => {
                      // Reset color after animation is complete
                      if (changedItems[item.key]) {
                        setTimeout(() => {
                          // Delay the reset to avoid it immediately overriding the animation
                          setChangedItems((prev) => ({ ...prev, [item.key]: false }));
                        }, 300); // Adjust this delay to match the animation time
                      }
                    }}
                  >
                    <item.icon />
                  </motion.div>

                  {/* Animate label */}
                  <motion.span
                    className="flex-1 block"
                    animate={changedItems[item.key] ? { opacity: 1, x: 0 } : { opacity: 0.7 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Animate value with color change */}
                  <motion.span
                    className="font-semibold block"
                    animate={{
                      opacity: changedItems[item.key] ? 1 : 0.7,
                      x: 0,
                      color: itemDirection[item.key] === 'increase' ? 'green' : itemDirection[item.key] === 'decrease' ? 'red' : 'black',
                    }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    onAnimationComplete={() => {
                      // Reset color after animation is complete
                      if (changedItems[item.key]) {
                        setTimeout(() => {
                          // Delay the reset to avoid it immediately overriding the animation
                          setChangedItems((prev) => ({ ...prev, [item.key]: false }));
                        }, 300); // Adjust this delay to match the animation time
                      }
                    }}
                  >
                    {item.value}
                  </motion.span>
                </div>
                <Separator className="my-1" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}