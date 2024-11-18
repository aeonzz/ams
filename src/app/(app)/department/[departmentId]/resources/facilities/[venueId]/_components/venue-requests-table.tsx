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
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Dot, Search } from "lucide-react";
import type { VenueRequestsTableType } from "./types";
import { Badge } from "@/components/ui/badge";

interface VenueRequestsTableProps {
  requests: VenueRequestsTableType[];
}

export default function VenueRequestsTable({
  requests,
}: VenueRequestsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<VenueRequestsTableType>[] = React.useMemo(
    () => [
      {
        accessorKey: "requestsTitle",
        header: "Title",
        cell: ({ row }) => {
          return (
            <Link
              href={`/request/${row.original.id}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-foreground"
              )}
              prefetch
            >
              {row.getValue("requestsTitle")}
            </Link>
          );
        },
      },
      {
        accessorKey: "requestsStatus",
        header: "Status",
        cell: ({ row }) => {
          const { color, stroke, variant } = getStatusColor(
            row.original.requestsStatus
          );
          return (
            <div className="flex items-center">
              <Badge variant={variant} className="pr-3.5">
                <Dot
                  className="mr-1 size-3"
                  strokeWidth={stroke}
                  color={color}
                />
                {textTransform(row.original.requestsStatus)}
              </Badge>
            </div>
          );
        },
        size: 0,
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ cell }) => {
          return (
            <P className="text-muted-foreground">
              {format(cell.getValue() as Date, "PP")}
            </P>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: requests,
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
    <div className="space-y-3 m-6 ml-0">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm pl-8"
          />
        </div>
      </div>
      <div className="scroll-bar h-[72vh] overflow-y-auto">
        <Table className="border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-5 bg-transparent">
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
                    <TableCell key={cell.id} className="py-1">
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
      <DataTablePagination table={table} showSelectedRows={false} />
    </div>
  );
}
