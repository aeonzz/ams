"use client";

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
import { cn } from "@/lib/utils";
import type {
  DepartmentWithRelations,
  RequestWithRelations,
} from "prisma/generated/zod";
import { P } from "@/components/typography/text";

interface JobRequestChartProps {
  data: DepartmentWithRelations;
  className?: string;
}

const processChartData = (requests: RequestWithRelations[]) => {
  const weeklyData: { [key: string]: { created: number; completed: number } } =
    {};

  requests.forEach((request) => {
    if (request.jobRequest) {
      const createdWeek = new Date(request.createdAt)
        .toISOString()
        .slice(0, 10);
      const completedWeek = request.jobRequest.endDate
        ? new Date(request.jobRequest.endDate).toISOString().slice(0, 10)
        : null;

      if (!weeklyData[createdWeek]) {
        weeklyData[createdWeek] = { created: 0, completed: 0 };
      }
      weeklyData[createdWeek].created++;

      if (completedWeek) {
        if (!weeklyData[completedWeek]) {
          weeklyData[completedWeek] = { created: 0, completed: 0 };
        }
        weeklyData[completedWeek].completed++;
      }
    }
  });

  return Object.entries(weeklyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({ week, ...data }));
};

const chartConfig = {
  created: {
    label: "Created Job Requests",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed Job Requests",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function JobRequestChart({
  data,
  className,
}: JobRequestChartProps) {
  const chartData = processChartData(data.request);
  const latestWeek = chartData[chartData.length - 1];
  const previousWeek = chartData[chartData.length - 2];
  const createdTrend = previousWeek
    ? ((latestWeek.created - previousWeek.created) / previousWeek.created) * 100
    : 0;
  const completedTrend = previousWeek
    ? ((latestWeek.completed - previousWeek.completed) /
        previousWeek.completed) *
      100
    : 0;

  return (
    <Card className={cn("bg-transparent", className)}>
      <CardHeader className="w-full flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle>Job Requests Over Time</CardTitle>
          <CardDescription>
            Weekly job requests created and completed
          </CardDescription>
        </div>
        <P className="flex items-center gap-2 leading-none text-muted-foreground">
          {chartData.length}-day period
        </P>
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
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent  className="min-w-52" />
              }
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
        <div className="flex w-full flex-col text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Completed job requests {completedTrend > 0 ? "up" : "down"} by{" "}
            {Math.abs(completedTrend).toFixed(1)}% this week
            {completedTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <P className="text-muted-foreground">
            This chart shows weekly trends of job requests created and
            completed, helping track department activity and performance over
            time.
          </P>
        </div>
      </CardFooter>
    </Card>
  );
}
