"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequestByVenueId } from "@/lib/actions/venue";
import { getDepartmentJobEvaluation } from "@/lib/actions/job-evaluation";
import { getJobEvaluationColumns } from "./job-evaluation-table-columns";
import type { DepartmentJobEvaluation } from "./types";

interface JobEvaluationTableProps {
  jobEvaluationPromise: ReturnType<typeof getDepartmentJobEvaluation>;
}

export function JobEvaluationTable({
  jobEvaluationPromise,
}: JobEvaluationTableProps) {
  const { data, pageCount } = React.use(jobEvaluationPromise);

  const columns = React.useMemo(() => getJobEvaluationColumns(), []);

  const filterFields: DataTableFilterField<DepartmentJobEvaluation>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter title...",
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
        <VenueRequestTableFloatingBar
          table={table}
          fileName={`${venue?.name} - Requests`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VenueRequestTableToolbarActions
          table={table}
          fileName={`${venue?.name} - Requests`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
