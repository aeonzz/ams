import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import React from "react";
import { JobRequestTable } from "./job-request-table";
import { getDepartmentJobRequests } from "@/lib/actions/job";

interface DepartmentJobRequestScreenProps {
  departmentId: string;
  searchParams: GetRequestsSchema;
}

export default function DepartmentJobRequestScreen({
  departmentId,
  searchParams,
}: DepartmentJobRequestScreenProps) {
  const jobRequestPromise = getDepartmentJobRequests({
    ...searchParams,
    departmentId: departmentId,
  });

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columnCount={4}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
          shrinkZero
        />
      }
    >
      <JobRequestTable
        jobRequestPromise={jobRequestPromise}
        departmentId={departmentId}
      />
    </React.Suspense>
  );
}
