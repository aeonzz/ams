"use client";
"use memo";

import * as React from "react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentUsers } from "@/lib/actions/department";
import type { UserType } from "@/lib/types/user";
import { ModifiedDataTable } from "@/components/data-table/modified-data-table";
import { getDepartmentUsersColumns } from "./department-users-columns";
import { DepartmentUsersTableToolbarActions } from "./department-users-table-toolbar-actions";
import { DepartmentUsersTableFloatingBar } from "./department-users-table-floating-bar";

interface DepartmentUsersTableProps {
  usersPromise: ReturnType<typeof getDepartmentUsers>;
  departmentId: string;
}

export function DepartmentUsersTable({
  usersPromise,
  departmentId,
}: DepartmentUsersTableProps) {
  const { data, pageCount } = React.use(usersPromise);

  const columns = React.useMemo(
    () => getDepartmentUsersColumns({ departmentId }),
    []
  );

  const filterFields: DataTableFilterField<UserType>[] = [
    {
      label: "Email",
      value: "email",
      placeholder: "Filter emails...",
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
    <ModifiedDataTable
      table={table}
      floatingBar={
        <DepartmentUsersTableFloatingBar
          table={table}
          departmentId={departmentId}
        />
      }
      className="py-2"
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <DepartmentUsersTableToolbarActions table={table} />
      </DataTableToolbar>
    </ModifiedDataTable>
  );
}
