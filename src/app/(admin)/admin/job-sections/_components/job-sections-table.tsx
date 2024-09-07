"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { type Section } from "prisma/generated/zod";
import { getJobSectionsColumns } from "./job-sections-columns";
import { JobSectionsTableFloatingBar } from "./job-sections-table-floating-bar";
import { JobSectionsTableToolbarActions } from "./job-sections-table-toolbar-actions";
import { getJobSections } from "@/lib/actions/job";

interface JobSectionsTableProps {
  jobSectionPromise: ReturnType<typeof getJobSections>;
}

export function JobSectionsTable({ jobSectionPromise }: JobSectionsTableProps) {
  const { data, pageCount } = React.use(jobSectionPromise);

  const columns = React.useMemo(() => getJobSectionsColumns(), []);

  const filterFields: DataTableFilterField<Section>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter name...",
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
      floatingBar={<JobSectionsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <JobSectionsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
