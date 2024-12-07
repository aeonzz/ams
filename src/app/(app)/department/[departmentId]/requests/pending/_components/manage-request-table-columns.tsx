"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  cn,
  formatDate,
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusColor,
  textTransform,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { P } from "@/components/typography/text";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RequestTableType } from "@/lib/types/request";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function getManageRequestsColumns(): ColumnDef<RequestTableType>[] {
  return [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Type" />
        </div>
      ),
      cell: ({ row }) => {
        const { icon: Icon, variant } = getRequestTypeIcon(row.original.type);
        return (
          <div className="flex items-center justify-center">
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
      size: 0,
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
      size: 100,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="px-2">
          <DataTableColumnHeader column={column} title="status" />
        </div>
      ),
      cell: ({ row }) => {
        const { color, stroke, variant } = getStatusColor(row.original.status);
        return (
          <div className="flex items-center">
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="px-2">
          <DataTableColumnHeader column={column} title="Requested" />
        </div>
      ),
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center gap-3">
            <P className="text-muted-foreground">
              {format(cell.getValue() as Date, "PP")}
            </P>
            <Avatar className="size-5 rounded-full">
              <AvatarImage src={`${row.original.user.profileUrl}`} />
              <AvatarFallback className="rounded-full">
                {row.original.user.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
      size: 0,
    },
  ];
}
