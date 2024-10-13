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
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { H2, H3, H4, P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import type { Request } from "prisma/generated/zod";
import { format } from "date-fns";

interface DepartmentRequestsTableProps {
  data: Request[];
  className?: string;
}

export default function DepartmentRequestsTable({
  data,
  className,
}: DepartmentRequestsTableProps) {
  const columns: ColumnDef<Request>[] = React.useMemo(
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
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const { color, stroke, variant } = getStatusColor(
            row.original.status
          );
          return (
            <div className="flex items-center">
              <Badge variant={variant} className="pr-3.5">
                <Dot
                  className="mr-1 size-3"
                  strokeWidth={stroke}
                  color={color}
                />
                {textTransform(row.original.status)}
              </Badge>
            </div>
          );
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
      {
        accessorKey: "updatedAt",
        header: "Last Modified",
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={cn("rounded-md border p-3", className)}>
      <div className="flex items-center justify-between px-3 py-1">
        <H3 className="font-semibold tracking-tight">All Requests</H3>
      </div>
      <div className="scroll-bar overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-transparent px-5">
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
                    <TableCell key={cell.id} className="">
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
      <div className="px-4 py-2">
        <DataTablePagination table={table} showSelectedRows={false} />
      </div>
    </div>
  );
}
