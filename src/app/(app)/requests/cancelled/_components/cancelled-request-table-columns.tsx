"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  formatDate,
  getPriorityIcon,
  getRequestTypeIcon,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { type Request } from "prisma/generated/zod";
import { P } from "@/components/typography/text";

export function getCancelledRequestColumns(): ColumnDef<Request>[] {
  return [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const { icon: Icon, variant } = getRequestTypeIcon(row.original.type);
        const type = `${row.original.type.charAt(0)}${row.original.type.slice(1).toLowerCase()}`;
        return (
          <Badge variant={variant}>
            <Icon
              className="mr-2 size-4"
              aria-hidden="true"
            />
            <P>{type}</P>
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      meta: {
        hidden: true,
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
