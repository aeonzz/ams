"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
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
import { JobRequestWithRelations } from "prisma/generated/zod";

export const description = "A donut chart showing job status distribution";

const chartConfig = {
  jobs: {
    label: "Jobs",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-5))",
  },
  on_hold: {
    label: "On Hold",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface JobStatusChartProps {
  data: JobRequestWithRelations[];
}

export default function JobStatusChart({ data }: JobStatusChartProps) {
  const jobStatusCounts = React.useMemo(() => {
    const counts = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0,
      cancelled: 0,
    };
    data.forEach((request) => {
      counts[request.status.toLowerCase() as keyof typeof counts]++;
    });
    return counts;
  }, [data]);

  const chartData = React.useMemo(
    () =>
      Object.entries(jobStatusCounts).map(([status, count]) => ({
        status,
        count,
        fill: `var(--color-${status})`,
      })),
    [jobStatusCounts]
  );

  const totalJobs = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex w-fit flex-col bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Job Status Distribution</CardTitle>
        <CardDescription>Assigned Job Requests</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
                          {totalJobs.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Jobs
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
          {chartData[2].count} completed jobs <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total job requests and their current statuses
        </div>
      </CardFooter>
    </Card>
  );
}
