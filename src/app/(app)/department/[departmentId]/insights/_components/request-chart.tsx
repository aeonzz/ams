"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { cn, textTransform } from "@/lib/utils";
import { P } from "@/components/typography/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { DepartmentOverViewData } from "./types";

const chartConfig = {
  created: {
    label: "Created Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export type TimeRange = "day" | "week" | "month";

export const processChartData = (
  requests: DepartmentOverViewData["requests"],
  range: TimeRange
) => {
  const data: { [key: string]: { created: number } } = {};

  requests.forEach((request) => {
    let key: string;
    const createdDate = new Date(request.createdAt);

    switch (range) {
      case "day":
        key = createdDate.toISOString().slice(0, 10);
        break;
      case "week":
        const weekStart = new Date(createdDate);
        weekStart.setDate(createdDate.getDate() - createdDate.getDay());
        key = weekStart.toISOString().slice(0, 10);
        break;
      case "month":
        key = createdDate.toISOString().slice(0, 7);
        break;
    }

    if (!data[key]) {
      data[key] = { created: 0 };
    }
    data[key].created++;
  });

  return Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));
};

interface RequestChartProps {
  data: DepartmentOverViewData;
  className?: string;
  dateRange: DateRange | undefined;
  exporting?: boolean;
  requestType: RequestTypeType | "";
  setTimeRange: (timeRange: TimeRange) => void;
  timeRange: TimeRange;
}

export default function RequestChart({
  data,
  className,
  dateRange,
  exporting = false,
  requestType,
  setTimeRange,
  timeRange,
}: RequestChartProps) {
  const chartData = React.useMemo(
    () => processChartData(data.requests, timeRange),
    [data.requests, timeRange]
  );

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    switch (timeRange) {
      case "day":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "week":
        return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
    }
  };

  const dateRangeText =
    dateRange?.from && dateRange?.to
      ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
      : "All time";

  return (
    <Card className={cn("bg-transparent", className)}>
      <CardHeader className="w-full flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle>Requests Over Time</CardTitle>
          <CardDescription>
            {timeRange === "day"
              ? "Daily"
              : timeRange === "week"
                ? "Weekly"
                : "Monthly"}{" "}
            requests created
            {requestType && ` for ${textTransform(requestType)} requests`} /
            Date Range: {dateRangeText}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger
            className={cn(exporting && "bg-transparent", "w-[180px]")}
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-60 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -28,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatXAxis}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={<ChartTooltipContent className="min-w-52" />}
            />
            <defs>
              <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="created"
              stroke="var(--color-created)"
              fillOpacity={0.4}
              fill="url(#fillCreated)"
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2 text-sm">
          <P className="font-medium leading-none">Requests Overview</P>
          <P className="leading-none text-muted-foreground">
            This chart shows the{" "}
            {timeRange === "day"
              ? "daily"
              : timeRange === "week"
                ? "weekly"
                : "monthly"}{" "}
            request trends
            {requestType && ` for ${textTransform(requestType)} requests`},
            providing insights into workload patterns over time. Data reflects
            the period: {dateRangeText}.
          </P>
        </div>
      </CardFooter>
    </Card>
  );
}
