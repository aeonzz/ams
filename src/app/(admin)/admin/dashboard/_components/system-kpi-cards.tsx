"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Users, FileText, CheckCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import NumberFlow from "@number-flow/react";
import { SystemOverViewData } from "./types";

interface SystemKPICardsProps {
  data: SystemOverViewData;
  className?: string;
  dateRange: DateRange | undefined;
  requestType: RequestTypeType | "";
  exporting?: boolean;
}

export default function SystemKPICards({
  data,
  className,
  dateRange,
  requestType,
  exporting = false,
}: SystemKPICardsProps) {
  const { requests, users } = data;

  // Initialize state for each KPI with 0
  const [animatedTotalRequests, setAnimatedTotalRequests] = React.useState(0);
  const [animatedCompletedTasks, setAnimatedCompletedTasks] = React.useState(0);
  const [animatedActiveUsers, setAnimatedActiveUsers] = React.useState(0);
  const [animatedCompletionHours, setAnimatedCompletionHours] =
    React.useState(0);
  const [animatedCompletionMinutes, setAnimatedCompletionMinutes] =
    React.useState(0);

  const filteredCompletedTasks = React.useMemo(() => {
    return requests.filter((r) => {
      const completedAt = r.completedAt ? new Date(r.completedAt) : null;
      return (
        completedAt &&
        r.status === "COMPLETED" &&
        (!dateRange?.from || completedAt >= dateRange.from) &&
        (!dateRange?.to || completedAt <= dateRange.to)
      );
    });
  }, [requests, dateRange]);

  // Calculate KPIs
  const totalRequests = requests.length;
  const completedTasks = filteredCompletedTasks.length;
  const activeUsers = users.filter((ud) => !ud.isArchived).length;

  const totalCompletionTime = filteredCompletedTasks.reduce((sum, r) => {
    const completedAt = r.completedAt ? new Date(r.completedAt) : null;
    const createdAt = r.createdAt ? new Date(r.createdAt) : null;
    if (!completedAt || !createdAt) return sum;
    return sum + (completedAt.getTime() - createdAt.getTime());
  }, 0);

  const averageCompletionTimeInMinutes =
    filteredCompletedTasks.length > 0
      ? totalCompletionTime / filteredCompletedTasks.length / (1000 * 60)
      : 0;

  const averageCompletionHours = Math.floor(
    averageCompletionTimeInMinutes / 60
  );
  const averageCompletionMinutes = Math.round(
    averageCompletionTimeInMinutes % 60
  );

  const periodText = dateRange ? "in selected period" : "overall";
  const typeText = requestType ? `for ${requestType} requests` : "";

  // Update states to trigger animations
  React.useEffect(() => {
    setAnimatedTotalRequests(totalRequests);
    setAnimatedCompletedTasks(completedTasks);
    setAnimatedActiveUsers(activeUsers);
    setAnimatedCompletionHours(averageCompletionHours);
    setAnimatedCompletionMinutes(averageCompletionMinutes);
  }, [
    totalRequests,
    completedTasks,
    activeUsers,
    averageCompletionHours,
    averageCompletionMinutes,
  ]);

  return (
    <div
      className={cn(
        "grid w-full gap-3 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      <Card className={cn(exporting && "bg-transparent")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {exporting ? (
            <p className="text-2xl font-bold">{totalRequests}</p>
          ) : (
            <NumberFlow
              willChange
              continuous
              value={animatedTotalRequests}
              format={{ useGrouping: false }}
              className="text-2xl font-bold"
              aria-hidden
            />
          )}
          <p className="text-xs text-muted-foreground">
            All submitted requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card className={cn(exporting && "bg-transparent")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Requests
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {exporting ? (
            <p className="text-2xl font-bold">{completedTasks}</p>
          ) : (
            <NumberFlow
              willChange
              continuous
              value={animatedCompletedTasks}
              format={{ useGrouping: false }}
              className="text-2xl font-bold"
              aria-hidden
            />
          )}
          <p className="text-xs text-muted-foreground">
            Successfully completed requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card className={cn(exporting && "bg-transparent")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Completion Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 text-2xl font-bold">
            <div className="flex items-end gap-1">
              {exporting ? (
                <p className="text-2xl font-bold">{averageCompletionHours}</p>
              ) : (
                <NumberFlow
                  willChange
                  continuous
                  value={animatedCompletionHours}
                  format={{ useGrouping: false }}
                  isolate
                  aria-hidden
                />
              )}
              <span className="text-lg font-semibold text-muted-foreground">
                hr
              </span>
            </div>
            <div className="flex items-end gap-1">
              {exporting ? (
                <p className="text-2xl font-bold">{averageCompletionMinutes}</p>
              ) : (
                <NumberFlow
                  willChange
                  continuous
                  value={animatedCompletionMinutes}
                  format={{ useGrouping: false }}
                  isolate
                  aria-hidden
                />
              )}
              <span className="text-lg font-semibold text-muted-foreground">
                min
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Average time to complete requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card className={cn(exporting && "bg-transparent")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {exporting ? (
            <p className="text-2xl font-bold">{activeUsers}</p>
          ) : (
            <NumberFlow
              willChange
              continuous
              value={animatedActiveUsers}
              format={{ useGrouping: false }}
              className="text-2xl font-bold"
              aria-hidden
            />
          )}
          <p className="text-xs text-muted-foreground">
            Users engaged with the system {periodText}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
