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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type InventorySubItem, ItemStatusSchema } from "prisma/generated/zod";
import { format, formatDate } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn, getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { P } from "@/components/typography/text";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import type { ItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";

interface SubItemsTableProps {
  subItems: InventorySubItem[];
  inventoryId: string;
}

export default function SubItemsTable({
  subItems,
  inventoryId,
}: SubItemsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  const columns: ColumnDef<InventorySubItem>[] = React.useMemo(
    () => [
      {
        accessorKey: "subName",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("subName")}</div>,
      },
      {
        accessorKey: "serialNumber",
        header: "Serial Number",
        cell: ({ row }) => <div>{row.getValue("serialNumber") || "-"}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as ItemStatusType;
          const { icon: Icon, variant } = getReturnableItemStatusIcon(status);
          return (
            <Badge variant={variant}>
              <Icon className="mr-1 size-4" />
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date Created",
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
    data: subItems,
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

  const filteredSubItems = table.getFilteredRowModel().rows;

  return (
    <div className="m-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Input
            placeholder="Filter by name or serial number"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? null : value);
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {ItemStatusSchema.options.map((status) => (
                <SelectItem key={status} value={status}>
                  {textTransform(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3">
          <P>Total: {filteredSubItems.length} Items</P>
          <Link
            href={`/admin/inventory/lendable-items/${inventoryId}?page=1&per_page=10&sort=createdAt.desc`}
            className={cn(buttonVariants({ variant: "link", size: "sm" }))}
            prefetch
          >
            See all
          </Link>
        </div>
      </div>
      <div className="scroll-bar max-h-[420px] overflow-y-auto">
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
