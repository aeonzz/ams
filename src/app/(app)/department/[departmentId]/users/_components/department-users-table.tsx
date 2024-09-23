"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentUsers } from "@/lib/actions/department";
import { getUsersColumns } from "@/app/(admin)/admin/users/_components/users-table-columns";
import type { UserType } from "@/lib/types/user";
import { UsersTableFloatingBar } from "@/app/(admin)/admin/users/_components/users-table-floating-bar";
import UserUserRolesTable from "@/app/(admin)/admin/users/_components/user-user-roles-table";
import { UsersTableToolbarActions } from "@/app/(admin)/admin/users/_components/users-table-toolbar-actions";

interface DepartmentUsersTableProps {
  usersPromise: ReturnType<typeof getDepartmentUsers>;
}

export function DepartmentUsersTable({
  usersPromise,
}: DepartmentUsersTableProps) {
  const { data, pageCount } = React.use(usersPromise);

  const columns = React.useMemo(
    () => getUsersColumns({ isDepartmentScreen: true }),
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
    <DataTable
      table={table}
      floatingBar={<UsersTableFloatingBar table={table} />}
      renderSubComponent={({ row }) => {
        const formattedUserRoles = row.original.userRole.map((role) => ({
          departmentName: role.department.name,
          roleName: role.role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        }));

        return <UserUserRolesTable userRoles={formattedUserRoles} />;
      }}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UsersTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
