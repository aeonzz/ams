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
import { ChevronDown, Dot } from "lucide-react";
import {
  RequestStatusTypeSchema,
  RequestTypeSchema,
  type Request,
} from "prisma/generated/zod";
import { format } from "date-fns";
import { StatusFilter } from "./status-filter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { DateRange } from "react-day-picker";

interface DepartmentRequestsTableProps {
  data: Request[];
  className?: string;
  dateRange: DateRange | undefined;
  requestType: RequestTypeType | "";
}

export default function DepartmentRequestsTable({
  data,
  className,
  dateRange,
  requestType,
}: DepartmentRequestsTableProps) {
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  const filteredData = React.useMemo(() => {
    const filterByDateRange = (data: Request[]) => {
      if (!dateRange || (!dateRange.from && !dateRange.to)) return data;
      return data.filter((req) => {
        const createdAt = new Date(req.createdAt);
        return (
          (!dateRange.from || createdAt >= dateRange.from) &&
          (!dateRange.to || createdAt <= dateRange.to)
        );
      });
    };

    const filteredByType = requestType
      ? data.filter((req) => req.type === requestType)
      : data;

    return filterByDateRange(filteredByType);
  }, [requestType, dateRange, data]);

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
                prefetch
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
      // {
      //   accessorKey: "completedAt",
      //   header: "Completed",
      //   cell: ({ row }) => {
      //     return (
      //       <P className="text-muted-foreground">
      //         {row.original.completedAt
      //           ? format(row.original.completedAt, "PP p")
      //           : "-"}
      //       </P>
      //     );
      //   },
      // },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: statusFilter,
    },
    onGlobalFilterChange: setStatusFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (filterValue.length === 0) return true;
      const status = row.getValue(columnId) as string;
      return filterValue.includes(status);
    },
  });

  const statusOptions = React.useMemo(() => {
    return RequestStatusTypeSchema.options.map((status) => ({
      value: status,
      label: textTransform(status),
    }));
  }, []);

  return (
    <div className={cn("rounded-md border p-3", className)}>
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex space-x-3">
          <H3 className="font-semibold tracking-tight">All Requests</H3>
          <Input
            placeholder="Search titles..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-80"
          />
          <StatusFilter
            title="Status"
            options={statusOptions}
            onChange={(selectedStatuses) =>
              table.setGlobalFilter(selectedStatuses)
            }
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
