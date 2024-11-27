"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { getDepartmentJobRequests } from "@/lib/actions/job";
import type { DepartmentJobRequest } from "./types";
import { getJobRequestColumns } from "./job-request-table-columns";
import { JobRequestTableFloatingBar } from "./job-request-table-floating-bar";
import { JobRequestTableToolbarActions } from "./job-request-table-toolbar-actions";

interface JobRequestTableProps {
  jobRequestPromise: ReturnType<typeof getDepartmentJobRequests>;
  departmentId: string;
}

export function JobRequestTable({
  jobRequestPromise,
  departmentId,
}: JobRequestTableProps) {
  const { data, pageCount, department } = React.use(jobRequestPromise);

  const columns = React.useMemo(() => getJobRequestColumns(), []);

  const filterFields: DataTableFilterField<DepartmentJobRequest>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter title...",
    },
    {
      label: "ID",
      value: "id",
      placeholder: "Search id...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  // const formattedData = allRequest?.map((request) => ({
  //   requestId: request.request.id,
  //   title: request.request.title,
  //   status: request.request.status,
  //   createdAt: request.request.createdAt,
  //   actualStart: request.actualStart,
  //   completedAt: request.request.completedAt,
  //   dateAndTimeNeeded: request.dateAndTimeNeeded,
  // }));

  return (
    <div className="space-y-2">
      {/* <TranpsortRequestCalendar data={formattedData} /> */}
      <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
        <DataTable
          table={table}
          floatingBar={
            <JobRequestTableFloatingBar
              table={table}
              fileName={`${department?.name} Job Requests`}
            />
          }
          className="rounded-md border py-2"
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <JobRequestTableToolbarActions
              table={table}
              fileName={`${department?.name} Job Requests`}
            >
              <Link
                prefetch
                className={cn(
                  buttonVariants({ variant: "ghost2", size: "sm" })
                )}
                href={`/department/${departmentId}/job-request/job-evaluation`}
              >
                <P>Job Evaluations</P>
              </Link>
            </JobRequestTableToolbarActions>
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  );
}
