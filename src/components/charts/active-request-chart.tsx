"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Tspan } from "../typography/text";

const chartData = [{ job: 1, reservation: 1 }];
const chartConfig = {
  job: {
    label: "Job request",
    color: "hsl(var(--chart-1))",
  },
  reservation: {
    label: "Reservation",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ActiveRequestChart() {
  const totalRequests =
    chartData[0].job + chartData[0].reservation;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Requests</CardTitle>
        <CardDescription>
          Overview of your current resource requests
        </CardDescription>
      </CardHeader>
      <CardContent className="flex pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={140}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalRequests.toLocaleString()}
                        </tspan>
                        <Tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Requests
                        </Tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="job"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-job)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="reservation"
              fill="var(--color-reservation)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
