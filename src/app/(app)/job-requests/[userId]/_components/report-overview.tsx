import React from "react";
import type { UserJobReportData } from "./types";
import JobStatusChart from "./job-status-pie-chart";
import UserPerfomanceLineChart from "./user-performance-line-chart";

interface ReportOverViewProps {
  data: UserJobReportData;
}

export default function ReportOverView({ data }: ReportOverViewProps) {
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <JobStatusChart data={data.requests} />
        <UserPerfomanceLineChart data={data.requests} />
      </div>
    </div>
  );
}
