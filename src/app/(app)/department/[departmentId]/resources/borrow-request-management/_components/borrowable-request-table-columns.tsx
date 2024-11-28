"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  cn,
  getRequestTypeIcon,
  getStatusColor,
  textTransform,
} from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Dot } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DepartmentBorrowableRequest } from "./types";

export function getBorrowableRequestColumns(): ColumnDef<DepartmentBorrowableRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-3">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.id}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <Link
              href={`/request/${row.original.id}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 text-foreground"
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
      accessorKey: "purpose",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Purpose" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <P className="truncate font-medium">{row.original.purpose}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <P className="truncate font-medium">
              {row.original.notes ? row.original.notes : "-"}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.itemName}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Status" />
        </div>
      ),
      cell: ({ row }) => {
        const { color, stroke, variant } = getStatusColor(row.original.status);
        return (
          <div className="flex items-center justify-center">
            <Badge variant={variant} className="pr-3.5">
              <Dot className="mr-1 size-3" strokeWidth={stroke} color={color} />
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
      accessorKey: "requester",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Requester" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.requester}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "reviewer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reviewed By" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.reviewer}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "dateAndTimeNeeded",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date and Time Needed" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP p")}
          </P>
        );
      },
      size: 0,
    },
    {
      accessorKey: "returnDateAndTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Date and Time" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP p")}
          </P>
        );
      },
      size: 0,
    },
    {
      accessorKey: "inProgress",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Progress" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            {row.original.inProgress !== null ? (
              <>
                {row.original.inProgress ? (
                  <Badge variant={"green"}>Ongoing</Badge>
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
      size: 0,
    },
    {
      accessorKey: "isOverdue",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Overdue" />
        </div>
      ),
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
      size: 0,
    },
    {
      accessorKey: "actualReturnDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actual Return Date" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {cell.getValue() ? format(cell.getValue() as Date, "PP p") : "-"}
          </P>
        );
      },
      size: 0,
    },
    {
      accessorKey: "isReturned",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Returned" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {row.original.isReturned !== null ? (
              <P className="truncate font-medium">
                {row.original.isReturned ? "Yes" : "No"}
              </P>
            ) : (
              "-"
            )}
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "returnCondition",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Return Condition" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.returnCondition ? row.original.returnCondition : "-"}
            </P>
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "completedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Completed At" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {cell.getValue() ? format(cell.getValue() as Date, "PP p") : "-"}
          </P>
        );
      },
      size: 0,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP")}
          </P>
        );
      },
      size: 0,
    },
  ];
}
