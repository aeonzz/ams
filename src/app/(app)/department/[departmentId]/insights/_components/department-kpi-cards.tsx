"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Users, FileText, CheckCircle } from "lucide-react";
import type { DepartmentWithRelations } from "prisma/generated/zod";

interface DepartmentKPICardsProps {
  data: DepartmentWithRelations;
  className?: string;
}

export default function DepartmentKPICards({
  data,
  className,
}: DepartmentKPICardsProps) {
  const { request, userDepartments } = data;

  // Calculate KPIs
  const totalRequests = request.length;
  const completedTasks = request.filter((r) => r.status === "COMPLETED").length;
  const activeUsers = userDepartments.filter(
    (ud) => !ud.user.isArchived
  ).length;

  const completedRequests = request.filter((r) => r.status === "COMPLETED");

  const totalCompletionTime = completedRequests.reduce((sum, r) => {
    const completedAt = r.completedAt ? new Date(r.completedAt) : null;
    const createdAt = r.createdAt ? new Date(r.createdAt) : null;

    if (!completedAt || !createdAt) {
      return sum; // Skip if either date is invalid
    }

    const completionTime = completedAt.getTime() - createdAt.getTime();
    return sum + completionTime;
  }, 0);

  const averageCompletionTime =
    completedRequests.length > 0
      ? totalCompletionTime / completedRequests.length / (1000 * 60 * 60) // Convert to hours
      : 0;

  // Round the average completion time to 2 decimal places
  const roundedAverageCompletionTime = Number(averageCompletionTime.toFixed(2));

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
            All submitted requests
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed requests
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
            Average time to complete requests
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
            Users engaged with the department
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
