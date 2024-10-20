"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
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
import type {
  DepartmentWithRelations,
  RequestWithRelations,
} from "prisma/generated/zod";
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

const chartConfig = {
  created: {
    label: "Created Requests",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed Requests",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type TimeRange = "day" | "week" | "month";

const processChartData = (
  requests: RequestWithRelations[],
  range: TimeRange,
  requestType: RequestTypeType | ""
) => {
  const data: { [key: string]: { created: number; completed: number } } = {};

  const filteredRequests = requestType
    ? requests.filter((request) => request.type === requestType)
    : requests;

  filteredRequests.forEach((request) => {
    let key: string;
    const createdDate = new Date(request.createdAt);
    const completedDate = request.completedAt
      ? new Date(request.completedAt)
      : null;

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
      data[key] = { created: 0, completed: 0 };
    }
    data[key].created++;

    if (completedDate) {
      let completedKey: string;
      switch (range) {
        case "day":
          completedKey = completedDate.toISOString().slice(0, 10);
          break;
        case "week":
          const weekStart = new Date(completedDate);
          weekStart.setDate(completedDate.getDate() - completedDate.getDay());
          completedKey = weekStart.toISOString().slice(0, 10);
          break;
        case "month":
          completedKey = completedDate.toISOString().slice(0, 7);
          break;
      }
      if (!data[completedKey]) {
        data[completedKey] = { created: 0, completed: 0 };
      }
      data[completedKey].completed++;
    }
  });

  return Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));
};

interface RequestChartProps {
  data: DepartmentWithRelations;
  className?: string;
  dateRange: DateRange | undefined;
  requestType: RequestTypeType | "";
}

export default function RequestChart({
  data,
  className,
  dateRange,
  requestType,
}: RequestChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const chartData = useMemo(
    () => processChartData(data.request, timeRange, requestType),
    [data.request, timeRange, requestType]
  );

  const latestPeriod = chartData[chartData.length - 1];
  const previousPeriod = chartData[chartData.length - 2];
  const createdTrend = previousPeriod
    ? ((latestPeriod.created - previousPeriod.created) /
        previousPeriod.created) *
      100
    : 0;
  const completedTrend = previousPeriod
    ? ((latestPeriod.completed - previousPeriod.completed) /
        previousPeriod.completed) *
      100
    : 0;

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
            requests created and completed
            {requestType && ` for ${textTransform(requestType)} requests`}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
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
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="completed"
              stroke="var(--color-completed)"
              fillOpacity={0.4}
              fill="url(#fillCompleted)"
              stackId="1"
            />
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
        <div className="flex w-full flex-col text-sm gap-2">
          <P className="font-medium leading-none">Requests</P>
          <P className="leading-none text-muted-foreground">
            This chart tracks the{" "}
            {timeRange === "day"
              ? "daily"
              : timeRange === "week"
                ? "weekly"
                : "monthly"}{" "}
            trends of requests created versus completed
            {requestType && ` for ${textTransform(requestType)} requests`},
            providing insights into the department&apos;s workload and
            efficiency in handling requests over time.
          </P>
        </div>
      </CardFooter>
    </Card>
  );
}
