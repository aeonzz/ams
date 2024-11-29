"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentsColumns } from "./departments-table-columns";
import { getDepartments } from "@/lib/actions/department";
import { Department } from "prisma/generated/zod";
import { DepartmentsTableFloatingBar } from "./departments-table-floating-bar";
import { DepartmentsTableToolbarActions } from "./departments-table-toolbar-actions";
import type { DepartmentsTableType } from "./types";
import DepartmentUsersTable from "./department-users-table";

interface DepartmentsTableProps {
  departmentsPromise: ReturnType<typeof getDepartments>;
}

export function DepartmentsTable({
  departmentsPromise,
}: DepartmentsTableProps) {
  const { data, pageCount } = React.use(departmentsPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getDepartmentsColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<DepartmentsTableType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    /* */
  });

  return (
    <DataTable
      table={table}
      floatingBar={<DepartmentsTableFloatingBar fileName="Departments" table={table} />}
      renderSubComponent={({ row }) => {
        return <DepartmentUsersTable data={row.original.users} />;
      }}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <DepartmentsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
