import React from "react";
import type { UserJobReportData } from "./types";
import JobStatusChart from "./job-status-pie-chart";
import UserPerfomanceLineChart from "./user-performance-line-chart";
import JobRequestsTable from "./job-requests-table";

interface ReportOverViewProps {
  data: UserJobReportData;
}

export default function ReportOverView({ data }: ReportOverViewProps) {
  const tableData = data.requests.map((request) => ({
    requestId: request.requestId,
    title: request.request.title,
    departmentName: request.request.department.name,
    status: request.status,
    startDate: request.startDate,
    endDate: request.endDate,
    createdAt: request.createdAt,
    jobType: request.jobType,
  }));
  return (
    <div className="space-y-3 p-3">
      <div className="flex gap-3">
        <JobStatusChart data={data.requests} />
        <UserPerfomanceLineChart data={data.requests} />
      </div>
      <JobRequestsTable requests={tableData} />
    </div>
  );
}
