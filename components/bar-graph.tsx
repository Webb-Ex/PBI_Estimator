"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Maximize } from "lucide-react";

// interface BarGraphProps {
//   chartData: Array<{
//     count: string;
//     lowCash: number;
//     invalidPin: number;
//     rejectedByIssuer: number;
//     networkFailure: number;
//     timeOut: number;
//   }>;
// }

interface BarGraphProps {
  chartData: Array<{
    failures: string;
    reasons: number;
    fill: string;
  }>;
}

const chartConfig = {
  reasons: {
    label: "Failure Reasons",
  },
  lowCash: {
    label: "Low Cash",
    color: "hsl(var(--chart-1))",
  },
  invalidPin: {
    label: "Invalid Pin",
    color: "hsl(var(--chart-2))",
  },
  rejectedByIssuer: {
    label: "Issuer Rejected",
    color: "hsl(var(--chart-3))",
  },
  networkFailure: {
    label: "Network Failure",
    color: "hsl(var(--chart-4))",
  },
  timeOut: {
    label: "Time out",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function BarGraph({ chartData }: BarGraphProps) {
  // chartData = [{ count: "Transactions Count", member: 186, network: 80 }];

  // 1. Low cash
  // 2. Invalid pin
  // 3. Rejected by issuer
  // 4. Network failure
  // 5. Time Out

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Top 5 Failure Reasons</CardTitle>
        <Drawer>
          <DrawerTrigger className="mt-3" asChild>
            <Button
              className="absolute right-[25px] top-[10px] w-[10px] h-[30px]"
              variant="outline"
            >
              <Maximize />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <CardHeader className="relative">
              <CardTitle>Top 5 Failure Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="w-full h-[75vh]" config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="failures"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}`} // You can customize the format here
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="reasons" strokeWidth={2} radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Showing Failure Reasons
              </div>
            </CardFooter>
          </DrawerContent>
        </Drawer>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="failures"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`} // You can customize the format here
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="reasons" strokeWidth={2} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing Failure Reasons
        </div>
      </CardFooter>
    </Card>
  );
}
