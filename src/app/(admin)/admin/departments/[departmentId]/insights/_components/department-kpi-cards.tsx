"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Users, FileText, CheckCircle } from "lucide-react";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { DateRange } from "react-day-picker";

interface DepartmentKPICardsProps {
  data: DepartmentWithRelations;
  className?: string;
  dateRange: DateRange | undefined;
}

export default function DepartmentKPICards({
  data,
  className,
  dateRange,
}: DepartmentKPICardsProps) {
  const { request, userDepartments } = data;

  const filteredData = React.useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return request;

    return request.filter((r) => {
      const createdAt = new Date(r.createdAt);
      //@ts-ignore
      return createdAt >= dateRange.from && createdAt <= dateRange.to;
    });
  }, [request, dateRange]);

  const filteredCompletedTasks = React.useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return request.filter((r) => r.status === "COMPLETED");
    }

    return request.filter((r) => {
      const completedAt = r.completedAt ? new Date(r.completedAt) : null;
      return (
        completedAt &&
        //@ts-ignore
        completedAt >= dateRange.from &&
        //@ts-ignore
        completedAt <= dateRange.to &&
        r.status === "COMPLETED"
      );
    });
  }, [request, dateRange]);

  const filteredUserDepartments = React.useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return userDepartments;

    return userDepartments.filter((ud) => {
      const createdAt = new Date(ud.createdAt);
      //@ts-ignore
      return createdAt >= dateRange.from && createdAt <= dateRange.to;
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
      return sum; // Skip if either date is invalid
    }

    const completionTime = completedAt.getTime() - createdAt.getTime();
    return sum + completionTime;
  }, 0);

  const averageCompletionTime =
    filteredCompletedTasks.length > 0
      ? totalCompletionTime / filteredCompletedTasks.length / (1000 * 60 * 60) // Convert to hours
      : 0;

  // Round the average completion time to 2 decimal places
  const roundedAverageCompletionTime = Number(averageCompletionTime.toFixed(2));

  const periodText = dateRange ? "in selected period" : "overall";

  return (
    <div className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-4", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRequests}</div>
          <p className="text-xs text-muted-foreground">
            All submitted requests {periodText}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Requests
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed requests {periodText}
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
            {roundedAverageCompletionTime} hours
          </div>
          <p className="text-xs text-muted-foreground">
            Average time to complete requests {periodText}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            Users engaged with the department {periodText}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
