"use client";

import React from "react";
import FetchDataError from "@/components/card/fetch-data-error";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import RequestStatusOverview from "./request-status--overview";
import JobRequestChart from "./job-request-chart";
import DepartmentKPICards from "./department-kpi-cards";
import DepartmentRequestsTable from "./requests-table";

interface DepartmentInsightsScreenProps {
  departmentId: string;
}

export default function DepartmentInsightsScreen({
  departmentId,
}: DepartmentInsightsScreenProps) {
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  if (isLoading) {
    return <p>...loading</p>;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="grid h-fit grid-flow-row grid-cols-3 gap-3">
      <DepartmentKPICards data={data} className="col-span-3" />
      <RequestStatusOverview data={data} className="h-[400px]" />
      {data.acceptsJobs && (
        <JobRequestChart data={data} className="col-span-2 h-[400px]" />
      )}
      <DepartmentRequestsTable data={data.request} className="col-span-3" />
    </div>
  );
}
