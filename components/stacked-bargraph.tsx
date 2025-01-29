"use client";

import { Maximize } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
const chartData = [
  { ratio: "Maximum", second: 186, minute: 80, hour: 43 },
  { ratio: "Average", second: 305, minute: 200, hour: 67 },
  { ratio: "Minimum", second: 237, minute: 120, hour: 88 },
];

const chartConfig = {
  second: {
    label: "Per Second",
    color: "hsl(var(--chart-1))",
  },
  minute: {
    label: "Per Minute",
    color: "hsl(var(--chart-2))",
  },
  hour: {
    label: "Per Hour",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function StackedBarGraph() {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Transaction Performance</CardTitle>

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
            <CardContent>
              <CardHeader>
                <CardTitle>Transaction Performance</CardTitle>
              </CardHeader>
              <ChartContainer className="w-full h-[75vh]" config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="ratio"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="second"
                    stackId="a"
                    fill="var(--color-second)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="minute"
                    stackId="a"
                    fill="var(--color-minute)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="hour"
                    stackId="a"
                    fill="var(--color-hour)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Showing Transaction Performance
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
              dataKey="ratio"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="second"
              stackId="a"
              fill="var(--color-second)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="minute"
              stackId="a"
              fill="var(--color-minute)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="hour"
              stackId="a"
              fill="var(--color-hour)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing Transaction Performance
        </div>
      </CardFooter>
    </Card>
  );
}
