"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
import { cn, textTransform } from "@/lib/utils";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";

const chartConfig = {
  requests: {
    label: "Requests",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-5))",
  },
  reviewed: {
    label: "Reviewed",
    color: "hsl(var(--chart-3))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-4))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface RequestStatusOverviewProps {
  data: DepartmentWithRelations;
  className?: string;
  requestType: RequestTypeType | "";
}

export default function RequestStatusOverview({
  data,
  className,
  requestType,
}: RequestStatusOverviewProps) {
  const { request, name } = data;

  const filteredRequests = React.useMemo(() => {
    return requestType
      ? request.filter((req) => req.type === requestType)
      : request;
  }, [request, requestType]);

  const requestStatusCounts = React.useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      reviewed: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
    };
    filteredRequests.forEach((request) => {
      counts[request.status.toLowerCase() as keyof typeof counts]++;
    });
    return counts;
  }, [filteredRequests]);

  const chartData = React.useMemo(
    () =>
      Object.entries(requestStatusCounts).map(([status, count]) => ({
        status,
        count,
        fill: `var(--color-${status})`,
      })),
    [requestStatusCounts]
  );

  const totalRequests = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const completedRequests = React.useMemo(() => {
    return chartData.find((d) => d.status === "completed")?.count || 0;
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col bg-transparent", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Request Status Overview</CardTitle>
        <CardDescription>
          {name} - {requestType ? textTransform(requestType) : "Overall"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalRequests.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Requests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Completion Rate:{" "}
          {totalRequests > 0
            ? ((completedRequests / totalRequests) * 100).toFixed(1)
            : "0"}
          %
        </div>
        <div className="text-center leading-none text-muted-foreground">
          Showing request status breakdown for {name}
          {requestType && ` - ${textTransform(requestType)} requests`}
        </div>
      </CardFooter>
    </Card>
  );
}