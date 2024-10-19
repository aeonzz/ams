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
import { format, formatDate } from "date-fns";
import { Input } from "@/components/ui/input";
import { P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import type { VenueAuditLogTableType } from "./types";
import { Search } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatFullName } from "@/lib/utils";
import JsonViewer from "./json-viewer";

interface VenueAuditLogTableProps {
  data: VenueAuditLogTableType[];
  globalFilter: string;
  setGlobalFilter: (globalFilter: string) => void;
}

export default function VenueAuditLogTable({
  data,
  globalFilter,
  setGlobalFilter,
}: VenueAuditLogTableProps) {
  const columns: ColumnDef<VenueAuditLogTableType>[] = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "changeType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Change Type" />
        ),
      },
      {
        accessorKey: "oldValue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Old Value" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[300px] overflow-hidden">
            <JsonViewer data={row.getValue("oldValue")} />
          </div>
        ),
      },
      {
        accessorKey: "newValue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="New Value" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[300px] overflow-hidden">
            <JsonViewer data={row.getValue("newValue")} />
          </div>
        ),
      },
      {
        accessorKey: "changedBy",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Changed By" />
        ),
        cell: ({ row }) => {
          return (
            <P>
              {formatFullName(
                row.original.firstName,
                row.original.middleName,
                row.original.lastName
              )}
            </P>
          );
        },
      },
      {
        accessorKey: "timestamp",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Timestamp" />
        ),
        cell: ({ row }) => formatDate(row.getValue("timestamp") as Date, "Pp"),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-auto">
      <div className="space-y-2.5">
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-5">
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
                      <TableCell key={cell.id}>
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
      </div>
      <DataTablePagination table={table} showSelectedRows={false} />
    </div>
  );
}
