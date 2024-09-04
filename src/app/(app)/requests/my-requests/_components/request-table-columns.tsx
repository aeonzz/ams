"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  formatDate,
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusIcon,
  textTransform,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Request, RequestSchema } from "prisma/generated/zod";
import { P } from "@/components/typography/text";
import { format } from "date-fns";

export function getRequestColumns(): ColumnDef<Request>[] {
  return [
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { icon: Icon, variant } = getStatusIcon(row.original.status);
        return (
          <div className="flex w-fit items-center">
            <Badge variant={variant}>
              <Icon className="mr- size-4" aria-hidden="true" />
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <P className="truncate font-medium">{row.original.title}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const { icon: Icon, variant } = getRequestTypeIcon(row.original.type);
        return (
          <div className="flex items-center">
            <Badge variant={variant}>
              <Icon className="mr-1 size-4" />
              {textTransform(row.original.type)}
            </Badge>
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
      cell: ({ cell }) => format(cell.getValue() as Date, "PPP p"),
    },
  ];
}
