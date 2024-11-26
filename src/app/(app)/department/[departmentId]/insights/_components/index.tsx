"use client";

import React from "react";
import FetchDataError from "@/components/card/fetch-data-error";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import RequestStatusOverview from "./request-status-overview";
import RequestChart, { TimeRange } from "./request-chart";
import DepartmentKPICards from "./department-kpi-cards";
import DepartmentRequestsTable from "./requests-table";
import { cn, textTransform } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import DepartmentInsightsSkeleton from "./department-insights-skeleton";
import { ItemRequestsChart } from "./item-requests-chart";
import { OverdueItemsChart } from "./overdue-items-chart";
import { RequestTypeSchema } from "prisma/generated/zod";
import { P } from "@/components/typography/text";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import DashboardActions from "@/app/(admin)/admin/dashboard/_components/dashboard-actions";
import { generateSystemReport } from "@/lib/fill-pdf/system-report";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { generateDepartmentReport } from "@/lib/fill-pdf/department-report";
import { useDashboardActions } from "@/lib/hooks/use-dashboard-actions";

interface DepartmentInsightsScreenProps {
  departmentId: string;
}

export default function DepartmentInsightsScreen({
  departmentId,
}: DepartmentInsightsScreenProps) {
  const currentUser = useSession();
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);
  const { setIsGenerating, timeRange, setTimeRange, requestType, date, reset } =
    useDashboardActions();

  const filteredData = React.useMemo(() => {
    if (!data) return { requests: [], users: [] };
    let filteredRequests = data.request;

    if (date?.from && date?.to) {
      filteredRequests = filteredRequests.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }

    if (requestType) {
      filteredRequests = filteredRequests.filter((r) => r.type === requestType);
    }

    let filteredUsers = data.userDepartments;
    if (date?.from && date?.to) {
      filteredUsers = filteredUsers.filter((u) => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }

    return {
      requests: filteredRequests,
      users: filteredUsers,
    };
  }, [data, date, requestType]);

  if (isLoading) {
    return (
      <div className="w-full">
        <DepartmentInsightsSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      await generateDepartmentReport({
        data: filteredData,
        date,
        requestType,
        currentUser,
        timeRange,
        setTimeRange,
        departmentName: data.name,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("An error occurred during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between">
        <div></div>
        <div className="flex gap-2">
          <DashboardActions
            data={data}
            isLoading={isLoading}
            generatePDF={generatePDF}
          />
        </div>
      </div>
      <div className="grid h-fit grid-flow-row grid-cols-3 gap-3 pb-3">
        <DepartmentKPICards
          data={filteredData}
          className="col-span-3"
          dateRange={date}
          requestType={requestType}
        />
        <RequestStatusOverview
          data={filteredData}
          requestType={requestType}
          className="h-[400px]"
        />
        <RequestChart
          data={filteredData}
          className="col-span-2 h-[400px]"
          requestType={requestType}
          dateRange={date}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        {/* {data.managesBorrowRequest &&  requestType === "" || requestType === "BORROW" ? (
          <>
            <OverdueItemsChart
              data={data}
              className="col-span-3 h-[400px]"
              dateRange={
                date?.from && date?.to
                  ? { from: date.from, to: date.to }
                  : undefined
              }
            />
            <ItemRequestsChart
              data={data}
              className="col-span-3 h-[400px]"
              dateRange={
                date?.from && date?.to
                  ? { from: date.from, to: date.to }
                  : undefined
              }
            />
          </>
        ) : null} */}

        <DepartmentRequestsTable
          data={data.request}
          requestType={requestType}
          className="col-span-3"
        />
      </div>
    </div>
  );
}
