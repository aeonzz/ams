"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
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
import { DepartmentWithRelations } from "prisma/generated/zod";
import { cn } from "@/lib/utils";

interface OverdueItemsChartProps {
  data: DepartmentWithRelations;
  className?: string;
  dateRange?: { from: Date; to: Date };
}

const chartConfig = {
  overdue: {
    label: "Overdue Requests",
    color: "hsl(var(--chart-4))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function OverdueItemsChart({
  data,
  className,
  dateRange,
}: OverdueItemsChartProps) {
  // Helper function to check if date falls within range
  const isWithinDateRange = (returnDate: Date | null) => {
    if (!returnDate || !dateRange) return true; // If no date range, include all
    const returnTime = new Date(returnDate).getTime();
    return (
      returnTime >= dateRange.from.getTime() &&
      returnTime <= dateRange.to.getTime()
    );
  };

  // Map through the inventory items and calculate overdue counts by item
  const chartData = data.inventoryItem.flatMap((item) => {
    const overdueCount = item.inventorySubItems.reduce((itemCount, subItem) => {
      return (
        itemCount +
        (subItem.returnableRequest?.filter(
          (req) => req.isOverdue && isWithinDateRange(req.returnDateAndTime)
        ).length || 0)
      );
    }, 0);

    return {
      itemName: item.name, // Display item name on y-axis
      overdue: overdueCount, // Overdue count for the item within the date range
    };
  });

  const totalOverdue = chartData.reduce((sum, item) => sum + item.overdue, 0);
  const maxOverdue = Math.max(...chartData.map((item) => item.overdue));

  return (
    <Card className={cn("bg-transparent", className)}>
      <CardHeader>
        <CardTitle>Overdue Requests by Item</CardTitle>
        <CardDescription>
          {dateRange
            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
            : "Overall overdue requests by item"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-60 w-full">
          <BarChart
            accessibilityLayer
            data={chartData} // Data reflects items and overdue requests within the date range
            layout="vertical" // Horizontal bar chart
            margin={{
              right: 16, // Same margin styling as the example
            }}
          >
            <CartesianGrid horizontal={false} /> {/* Grid styling */}
            <YAxis
              dataKey="itemName" // Show item names on y-axis
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)} // Truncate item names if too long
            />
            <XAxis dataKey="overdue" type="number" hide /> {/* Hide X axis */}
            <ChartTooltip
              cursor={false} // Disable hover cursor styling
              content={
                <ChartTooltipContent indicator="line" className="min-w-40" />
              }
            />
            <Bar
              dataKey="overdue"
              layout="vertical"
              fill="var(--color-overdue)" // Color for bars
              radius={8}
              maxBarSize={50}
            >
              <LabelList
                dataKey="itemName"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]" // Label styles from example
                fontSize={12}
              />
              <LabelList
                dataKey="overdue"
                position="right"
                offset={8}
                className="fill-foreground" // Foreground style for label
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Overdue Requests: {totalOverdue}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing overdue requests for each item in the department: {data.name}{" "}
          {/* Updated footer */}
        </div>
      </CardFooter>
    </Card>
  );
}
