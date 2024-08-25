"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { formatDate, getPriorityIcon, getStatusIcon } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Request, RequestSchema } from "prisma/generated/zod";
import { P } from "@/components/typography/text";

export function getRequestColumns(): ColumnDef<Request>[] {
  return [
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { icon: Icon } = getStatusIcon(row.original.status);
        const status = `${row.original.status.charAt(0)}${row.original.status.slice(1).toLowerCase()}`;
        return (
          <div className="flex items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <P>{status}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{row.original.type}</Badge>
            <P className="truncate font-medium">{row.getValue("title")}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <></>,
      cell: ({ row }) => {
        const Icon = getPriorityIcon(row.original.priority);
        const priority = row.original.priority
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        return (
          <div className="flex items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <P>{priority}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
  ];
}
