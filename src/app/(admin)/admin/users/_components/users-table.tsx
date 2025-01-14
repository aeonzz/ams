"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getUsersColumns } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { UsersTableFloatingBar } from "./users-table-floating-bar";
import { getUsers } from "@/lib/actions/users";
import { type UserType } from "@/lib/types/user";
import UserUserRolesTable from "./user-user-roles-table";

interface UsersTableProps {
  usersPromise: ReturnType<typeof getUsers>;
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  const { data, pageCount } = React.use(usersPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getUsersColumns(), []);

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
  const filterFields: DataTableFilterField<UserType>[] = [
    {
      label: "Email",
      value: "email",
      placeholder: "Filter emails...",
    },
    // {
    //   label: "First Name",
    //   value: "firstName",
    //   placeholder: "Filter First Names...",
    // },
    // {
    //   label: "Middle Name",
    //   value: "middleName",
    //   placeholder: "Filter Middle Names...",
    // },
    // {
    //   label: "Last Name",
    //   value: "lastName",
    //   placeholder: "Filter Last Names...",
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    getRowCanExpand: () => true,
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
      floatingBar={<UsersTableFloatingBar fileName="Users" table={table} />}
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
