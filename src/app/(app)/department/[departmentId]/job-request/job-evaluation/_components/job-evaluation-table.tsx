"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentJobEvaluation } from "@/lib/actions/job-evaluation";
import { getJobEvaluationColumns } from "./job-evaluation-table-columns";
import type { DepartmentJobEvaluation } from "./types";
import { JobEvaluationTableFloatingBar } from "./job-evaluation-table-floating-bar";
import { JobEvaluationTableToolbarActions } from "./job-evaluation-table-toolbar-actions";

interface JobEvaluationTableProps {
  jobEvaluationPromise: ReturnType<typeof getDepartmentJobEvaluation>;
}

export function JobEvaluationTable({
  jobEvaluationPromise,
}: JobEvaluationTableProps) {
  const { data, pageCount, department } = React.use(jobEvaluationPromise);

  const columns = React.useMemo(() => getJobEvaluationColumns(), []);

  const filterFields: DataTableFilterField<DepartmentJobEvaluation>[] = [
    {
      label: "Request ID",
      value: "requestId",
      placeholder: "Filter request id...",
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

  return (
    <DataTable
      table={table}
      floatingBar={
        <JobEvaluationTableFloatingBar
          table={table}
          fileName={`${department?.name} - Job Evaluation`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <JobEvaluationTableToolbarActions
          table={table}
          fileName={`${department?.name} - Job Evaluation`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
