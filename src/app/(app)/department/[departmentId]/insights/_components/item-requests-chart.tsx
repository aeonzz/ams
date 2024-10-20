"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { cn } from "@/lib/utils";

interface ItemRequestsChartProps {
  data: DepartmentWithRelations;
  className?: string;
  dateRange?: { from: Date; to: Date };
}

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ItemRequestsChart({
  data,
  dateRange,
  className,
}: ItemRequestsChartProps) {
  const processChartData = (data: DepartmentWithRelations) => {
    if (!data || !data.inventoryItem) return [];

    const itemCounts: { [key: string]: number } = {};

    // Initialize all items with 0 requests
    data.inventoryItem.forEach((item) => {
      itemCounts[item.name] = 0;
    });

    data.inventoryItem.forEach((item) => {
      item.inventorySubItems.forEach((subItem) => {
        if (subItem.returnableRequest && subItem.returnableRequest.length > 0) {
          const filteredRequests = subItem.returnableRequest.filter(
            (request) => {
              if (!dateRange)
                return (
                  request.request.status !== "REJECTED" &&
                  request.request.status !== "CANCELLED"
                );
              const requestDate = new Date(request.createdAt);
              return (
                request.request.status !== "REJECTED" &&
                request.request.status !== "CANCELLED" &&
                requestDate >= dateRange.from &&
                requestDate <= dateRange.to
              );
            }
          );

          itemCounts[item.name] += filteredRequests.length;
        }
      });
    });

    return Object.entries(itemCounts)
      .map(([name, requests]) => ({ name, requests }))
      .sort((a, b) => b.requests - a.requests);
  };

  const chartData = processChartData(data);

  if (chartData.length === 0) {
    return (
      <Card className={cn("bg-transparent", className)}>
        <CardHeader>
          <CardTitle>Item Requests by Category</CardTitle>
          <CardDescription>No items found in the inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There are no items in the inventory to display.</p>
        </CardContent>
      </Card>
    );
  }

  const totalRequests = chartData.reduce((sum, item) => sum + item.requests, 0);
  const topCategory =
    chartData.find((item) => item.requests > 0) || chartData[0];
  const percentageShare =
    totalRequests > 0
      ? ((topCategory.requests / totalRequests) * 100).toFixed(1)
      : "0.0";

  return (
    <Card className={cn("bg-transparent", className)}>
      <CardHeader>
        <CardTitle>Borrow Requests by Item</CardTitle>
        <CardDescription>
          {dateRange
            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
            : "Overall borrow requests by item"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <ResponsiveContainer width="100%">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 10 ? `${value.slice(0, 10)}...` : value
                }
              />
              {/* <YAxis tickLine={false} axisLine={false}  /> */}
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-center font-medium leading-none">
          {totalRequests > 0 ? (
            <>
              {topCategory.name} has the highest active request share at{" "}
              {percentageShare}% 
            </>
          ) : (
            "No active requests for any items"
          )}
        </div>
        <div className="w-full text-center leading-none text-muted-foreground">
          Showing item request counts for {chartData.length} items
        </div>
      </CardFooter>
    </Card>
  );
}
