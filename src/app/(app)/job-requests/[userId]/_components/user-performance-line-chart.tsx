import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

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

export const description = "User Performance Over Time";

const chartConfig = {
  jobsCompleted: {
    label: "Jobs Completed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface UserPerformanceAreaChartProps {
  data: JobRequestWithRelations[];
}

export default function UserPerformanceAreaChart({
  data,
}: UserPerformanceAreaChartProps) {
  const processData = (jobRequests: JobRequestWithRelations[]) => {
    const monthlyData: { [key: string]: number } = {};

    jobRequests.forEach((job) => {
      if (job.endDate) {
        const monthKey = format(parseISO(job.endDate.toString()), "yyyy-MM");
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    return sortedMonths.map((month) => ({
      month: month, // Store as ISO string
      jobsCompleted: monthlyData[month],
    }));
  };

  const chartData = processData(data);

  const calculatePerformanceChange = () => {
    if (chartData.length < 2) return 0;
    const lastMonth = chartData[chartData.length - 1].jobsCompleted;
    const previousMonth = chartData[chartData.length - 2].jobsCompleted;
    return ((lastMonth - previousMonth) / previousMonth) * 100;
  };

  const performanceChange = calculatePerformanceChange();

  const getDateRange = () => {
    if (chartData.length === 0) return "No data available";
    const startDate = format(parseISO(chartData[0].month), "MMMM yyyy");
    const endDate = format(
      parseISO(chartData[chartData.length - 1].month),
      "MMMM yyyy"
    );
    return `${startDate} - ${endDate}`;
  };

  const getYAxisDomain = () => {
    const maxJobs = Math.max(...chartData.map((data) => data.jobsCompleted));
    const buffer = Math.ceil(maxJobs * 0.2); 
    return [0, maxJobs + buffer];
  };

  return (
    <Card className="w-full bg-transparent">
      <CardHeader>
        <CardTitle>User Performance</CardTitle>
        <CardDescription>{getDateRange()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -28,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(parseISO(value), "MMM")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              domain={getYAxisDomain()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="line" className="min-w-36" />
              }
            />
            <defs>
              <linearGradient
                id="colorJobsCompleted"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-jobsCompleted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-jobsCompleted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="jobsCompleted"
              type="natural"
              fill="url(#colorJobsCompleted)"
              fillOpacity={0.4}
              stroke="var(--color-jobsCompleted)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {performanceChange >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(performanceChange).toFixed(1)}% this month{" "}
              <TrendingUp
                className={`h-4 w-4 ${performanceChange >= 0 ? "text-green-500" : "text-red-500"}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing jobs completed for the last {chartData.length} months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
