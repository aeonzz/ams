"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Users, FileText, CheckCircle } from "lucide-react";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { DateRange } from "react-day-picker";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import NumberFlow from "@number-flow/react";

interface DepartmentKPICardsProps {
  data: DepartmentWithRelations;
  className?: string;
  dateRange: DateRange | undefined;
  requestType: RequestTypeType | "";
}

export default function DepartmentKPICards({
  data,
  className,
  dateRange,
  requestType,
}: DepartmentKPICardsProps) {
  const { request, userDepartments } = data;

  const filteredData = React.useMemo(() => {
    let filtered = request;

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= dateRange.from! && createdAt <= dateRange.to!;
      });
    }

    if (requestType) {
      filtered = filtered.filter((r) => r.type === requestType);
    }

    return filtered;
  }, [request, dateRange, requestType]);

  const filteredCompletedTasks = React.useMemo(() => {
    return filteredData.filter((r) => {
      const completedAt = r.completedAt ? new Date(r.completedAt) : null;
      return (
        completedAt &&
        r.status === "COMPLETED" &&
        (!dateRange?.from || completedAt >= dateRange.from) &&
        (!dateRange?.to || completedAt <= dateRange.to)
      );
    });
  }, [filteredData, dateRange]);

  const filteredUserDepartments = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return userDepartments;

    return userDepartments.filter((ud) => {
      const createdAt = new Date(ud.createdAt);
      return createdAt >= dateRange.from! && createdAt <= dateRange.to!;
    });
  }, [userDepartments, dateRange]);

  // Calculate KPIs
  const totalRequests = filteredData.length;
  const completedTasks = filteredCompletedTasks.length;
  const activeUsers = filteredUserDepartments.filter(
    (ud) => !ud.user.isArchived
  ).length;

  const totalCompletionTime = filteredCompletedTasks.reduce((sum, r) => {
    const completedAt = r.completedAt ? new Date(r.completedAt) : null;
    const createdAt = r.createdAt ? new Date(r.createdAt) : null;

    if (!completedAt || !createdAt) {
      return sum;
    }

    const completionTime = completedAt.getTime() - createdAt.getTime();
    return sum + completionTime;
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

  return (
    <div className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-4", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <NumberFlow
            willChange
            continuous
            value={totalRequests}
            format={{ useGrouping: false }}
            className="text-2xl font-bold"
            aria-hidden
          />
          <p className="text-xs text-muted-foreground">
            All submitted requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <NumberFlow
            willChange
            continuous
            value={completedTasks}
            format={{ useGrouping: false }}
            className="text-2xl font-bold"
            aria-hidden
          />
          <p className="text-xs text-muted-foreground">
            Successfully completed requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Completion Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberFlow
              willChange
              continuous
              value={averageCompletionHours}
              format={{ useGrouping: false }}
              isolate
              aria-hidden
            />{" "}
            <span className="text-lg font-semibold text-muted-foreground">
              hr
            </span>{" "}
            <NumberFlow
              willChange
              continuous
              value={averageCompletionMinutes}
              format={{ useGrouping: false }}
              isolate
              aria-hidden
            />{" "}
            <span className="text-lg font-semibold text-muted-foreground">
              min
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Average time to complete requests {periodText} {typeText}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <NumberFlow
            willChange
            continuous
            value={activeUsers}
            format={{ useGrouping: false }}
            className="text-2xl font-bold"
            aria-hidden
          />
          <p className="text-xs text-muted-foreground">
            Users engaged with the department {periodText}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
