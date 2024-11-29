"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type UserRole = {
  departmentName: string;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;
};

interface UserUserRolesTableProps {
  userRoles: UserRole[];
}

export default function UserUserRolesTable({
  userRoles,
}: UserUserRolesTableProps) {
  console.log(userRoles);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<UserRole>[] = React.useMemo(
    () => [
      {
        accessorKey: "departmentName",
        header: "Department",
        cell: ({ row }) => <div>{row.getValue("departmentName")}</div>,
      },
      {
        accessorKey: "roleName",
        header: "Role",
        cell: ({ row }) => <div>{row.getValue("roleName")}</div>,
      },
      {
        accessorKey: "createdAt",
        header: "Date Created",
        cell: ({ row }) => formatDate(row.getValue("createdAt"), "PPP p"),
      },
      {
        accessorKey: "updatedAt",
        header: "Last Modified",
        cell: ({ row }) => formatDate(row.getValue("updatedAt"), "PPP p"),
      },
    ],
    []
  );

  const table = useReactTable({
    data: userRoles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
    },
  });

  const filteredRoles = table.getFilteredRowModel().rows;

  return (
    <div className="m-4 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by department or role"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {/* <div className="flex items-center space-x-3">
          <P>Total: {filteredRoles.length} Items</P>
          <Link
            href="/admin/role-management?page=1&per_page=10&sort=createdAt.desc"
            className={cn(buttonVariants({ variant: "link", size: "sm" }))}
            prefetch
          >
            See all
          </Link>
        </div> */}
      </div>
      <div className="scroll-bar max-h-[420px] overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-5 border-r">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
