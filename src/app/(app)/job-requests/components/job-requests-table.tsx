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
import { cn, getJobStatusColor, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import type { JobRequestsTableType } from "./type";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";

interface JobRequestsTableProps {
  data: JobRequestsTableType[];
}

export default function JobRequestsTable({ data }: JobRequestsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<JobRequestsTableType>[] = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Link
                href={`/request/${row.original.id}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto truncate p-0 text-foreground"
                )}
              >
                <P className="truncate font-medium">{row.original.title}</P>
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <div>{row.original.department}</div>,
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => formatDate(row.original.dueDate, "PP p"),
      },
      {
        accessorKey: "estimatedTime",
        header: "Estimated Time",
        cell: ({ row }) =>
          row.original.estimatedTime
            ? `${row.original.estimatedTime} hours`
            : "-",
      },
      {
        accessorKey: "status",
        header: "Job Status",
        cell: ({ row }) => {
          const { color, stroke, variant } = getJobStatusColor(
            row.original.jobStatus
          );
          return (
            <div className="flex items-center">
              <Badge variant={variant} className="pr-3.5">
                <Dot
                  className="mr-1 size-3"
                  strokeWidth={stroke}
                  color={color}
                />
                {textTransform(row.original.jobStatus)}
              </Badge>
            </div>
          );
        },
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

  const filteredRoles = table.getFilteredRowModel().rows;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 pb-0">
        <Input
          placeholder="Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center space-x-3">
          <P className="text-xs text-muted-foreground">
            Total: {filteredRoles.length} Requests
          </P>
        </div>
      </div>
      <div className="scroll-bar overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-r px-5">
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
      <div className="p-4 pt-0">
        <DataTablePagination table={table} showSelectedRows={false} />
      </div>
    </div>
  );
}
