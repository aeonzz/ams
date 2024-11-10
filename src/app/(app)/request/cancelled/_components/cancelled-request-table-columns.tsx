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

import { type Request } from "prisma/generated/zod";
import { P } from "@/components/typography/text";
import { Dot } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";

export function getCancelledRequestColumns(): ColumnDef<Request>[] {
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
            >
              <P className="truncate font-medium">{row.original.title}</P>
            </Link>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "priority",
    //   header: ({ column }) => <></>,
    //   cell: ({ row }) => {
    //     const Icon = getPriorityIcon(row.original.priority);
    //     const priority = row.original.priority
    //       .split("_")
    //       .map(
    //         (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    //       )
    //       .join(" ");

    //     return (
    //       <div className="flex items-center">
    //         <Icon
    //           className="mr-2 size-4 text-muted-foreground"
    //           aria-hidden="true"
    //         />
    //         <P>{priority}</P>
    //       </div>
    //     );
    //   },
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id));
    //   },
    // },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex justify-center px-2">
          <DataTableColumnHeader column={column} title="Created" />
        </div>
      ),
      cell: ({ cell }) => {
        return (
          <div className="flex items-center justify-center">
            <P className="text-muted-foreground">
              {format(cell.getValue() as Date, "PP")}
            </P>
          </div>
        );
      },
    },
  ];
}
