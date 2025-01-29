"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
// const chartData = [
//   { transaction: "member", decliners: 275, fill: "var(--color-member)" },
//   { transaction: "network", decliners: 200, fill: "var(--color-network)" },
// ];

interface HorizontalGraphData {
  horizontalChartData: Array<{
    transaction: string;
    decliners: number;
    fill: string;
  }>;
}

const chartConfig = {
  decliners: {
    label: "decliners",
  },
  member: {
    label: "Member",
    color: "hsl(var(--chart-1))",
  },
  network: {
    label: "Network",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HorizontalGraph({ horizontalChartData }: HorizontalGraphData) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Top 10 Decliners</CardTitle>
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
              <CardTitle>Top 10 Failure Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="w-full h-[75vh]" config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={horizontalChartData}
                  layout="vertical"
                  margin={{
                    left: 0,
                  }}
                >
                  <YAxis
                    dataKey="transaction"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                  {/* <XAxis dataKey="decliners" type="number" hide /> */}
                  <XAxis
                    dataKey="decliners"
                    type="number"
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="decliners" layout="vertical" radius={5} />
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
          <BarChart
            accessibilityLayer
            data={horizontalChartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="transaction"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            {/* <XAxis
              dataKey="decliners"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
            /> */}
            <XAxis
              dataKey="decliners"
              type="number"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="decliners" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing Decliners Reasons
        </div>
      </CardFooter>
    </Card>
  );
}
