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
import { Button, buttonVariants } from "@/components/ui/button";
import { H3, P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { UserBorrowData } from "./user-borrow-history-dialog";
import { Dot } from "lucide-react";

interface UserBorrowTableProps {
  data: UserBorrowData[];
  className?: string;
}

export default function UserBorrowTable({
  data,
  className,
}: UserBorrowTableProps) {
  const columns: ColumnDef<UserBorrowData>[] = React.useMemo(
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
                prefetch
              >
                <P className="truncate font-medium">{row.original.title}</P>
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const { color, stroke, variant } = getStatusColor(
            row.original.status
          );
          return (
            <div className="flex items-center justify-center">
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
        size: 0,
        filterFn: (row, id, value) => {
          return Array.isArray(value) && value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "isOverdue",
        header: "Is Overdue",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              {row.original.isOverdue !== null ? (
                <>
                  {row.original.status === "COMPLETED" ? (
                    <P className="truncate font-medium">
                      <>{row.original.isOverdue ? "Yes" : "No"}</>
                    </P>
                  ) : (
                    "-"
                  )}
                </>
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "inProgress",
        header: "Progress",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              {row.original.inProgress !== null ? (
                <>
                  {row.original.status === "COMPLETED" ? (
                    <>
                      {row.original.inProgress ? (
                        <Badge variant={"cyan"}>Ongoing</Badge>
                      ) : (
                        <Badge variant={"green"}>Completed</Badge>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </>
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "isLost",
        header: "Is Lost",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              {row.original.isLost !== null ? (
                <>
                  {row.original.status === "COMPLETED" ? (
                    <P className="truncate font-medium">
                      <>{row.original.isLost ? "Yes" : "No"}</>
                    </P>
                  ) : (
                    "-"
                  )}
                </>
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "completedAt",
        header: "Completed",
        cell: ({ cell }) => {
          return (
            <P className="text-muted-foreground">
              {cell.getValue() ? format(cell.getValue() as Date, "PP") : "-"}
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
    globalFilterFn: (row, columnId, filterValue) => {
      if (filterValue.length === 0) return true;
      const status = row.getValue(columnId) as string;
      return filterValue.includes(status);
    },
  });

  return (
    <div className={cn("rounded-md border p-3", className)}>
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex flex-col gap-3 lg:flex-row">
          <Input
            placeholder="Search titles..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-80"
          />
        </div>
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
