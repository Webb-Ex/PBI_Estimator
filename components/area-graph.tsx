"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Maximize } from "lucide-react";

interface AreaGraphData {
  areaChartData: Array<{
    time: string;
    transactions: number;
    amount: number;
  }>;
}

// const chartData = [
//   { date: "2024-04-01", time: 222, mobile: 150 },
//   { date: "2024-04-02", desktop: 97, mobile: 180 },
//   { date: "2024-04-03", desktop: 167, mobile: 120 },
// ];

const chartConfig = {
  visitors: {
    label: "Transactions",
  },
  transactions: {
    label: "Number of Transactions",
    color: "hsl(var(--chart-1))",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaGraph({ areaChartData }: AreaGraphData) {
  return (
    <Card>
      <CardHeader className="relative flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Transactions Snapshot</CardTitle>
        </div>
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
              <CardTitle>Transactions Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto w-full h-[75vh]"
              >
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient
                      id="fillTransactions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-transactions)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-transactions)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-amount)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-amount)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const time = new Date(`1970-01-01T${value}Z`); // assuming the time is in 24-hour format (HH:mm:ss)
                      return time.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    dataKey="amount"
                    // type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // tickFormatter={(value) =>
                    //   chartConfig[value as keyof typeof chartConfig]?.label
                    // }
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const time = new Date(`1970-01-01T${value}Z`); // assuming the time is in 24-hour format (HH:mm:ss)
                          return time.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="amount"
                    type="natural"
                    fill="url(#fillAmount)"
                    stroke="var(--color-amount)"
                    stackId="a"
                  />
                  <Area
                    dataKey="transactions"
                    type="natural"
                    fill="url(#fillTransactions)"
                    stroke="var(--color-transactions)"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </DrawerContent>
        </Drawer>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={areaChartData}>
            <defs>
              <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-transactions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-transactions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const time = new Date(`1970-01-01T${value}Z`); // assuming the time is in 24-hour format (HH:mm:ss)
                return time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              }}
            />

            <YAxis
              dataKey="amount"
              // type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const time = new Date(`1970-01-01T${value}Z`); // assuming the time is in 24-hour format (HH:mm:ss)
                    return time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
              stackId="a"
            />
            <Area
              dataKey="transactions"
              type="natural"
              fill="url(#fillTransactions)"
              stroke="var(--color-transactions)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
