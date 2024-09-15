"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRoleColumns } from "./role-management-table-columns";
import { getRoles } from "@/lib/actions/role";
import { RoleManagementTableFloatingBar } from "./role-management-table-floating-bar";
import { RoleManagementTableToolbarActions } from "./role-management-table-toolbar-actions";
import RoleUsersTable from "./role-users-table";
import type { RoleTableType } from "./types";

interface RoleManagementTableProps {
  roleManagementPromise: ReturnType<typeof getRoles>;
}

export function RoleManagementTable({
  roleManagementPromise,
}: RoleManagementTableProps) {
  const { data, pageCount } = React.use(roleManagementPromise);

  const columns = React.useMemo(() => getRoleColumns(), []);

  const filterFields: DataTableFilterField<RoleTableType>[] = [
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
      floatingBar={<RoleManagementTableFloatingBar table={table} />}
      renderSubComponent={({ row }) => {
        const formattedUserRoles = row.original.userRoles.map((userRoles) => ({
          ...userRoles,
          email: userRoles.user.email,
          firstName: userRoles.user.firstName,
          middleName: userRoles.user.middleName,
          lastName: userRoles.user.lastName,
          departmentName: userRoles.department.name,
        }));

        return <RoleUsersTable userRoles={formattedUserRoles} />;
      }}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <RoleManagementTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
