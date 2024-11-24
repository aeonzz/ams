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
import { TransportRequest } from "../../../../_components/types";
import { babelIncludeRegexes } from "next/dist/build/webpack-config";

export function getVehicleLogsColumns(): ColumnDef<TransportRequest>[] {
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[30vw] space-x-2">
            <P className="truncate font-medium">{row.original.description}</P>
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
      accessorKey: "numberOfPassengers",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Number of Passengers" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.numberOfPassengers}
            </P>
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "passengersName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Passengers" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[20vw] flex-wrap gap-1">
            {row.original.passengersName.map((p, index) => (
              <Badge key={index} variant="outline" className="truncate font-medium">
                {p}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "destination",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Destination" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.destination}</P>
          </div>
        );
      },
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
          <div className="flex items-center justify-center">
            <Badge variant={row.original.inProgress ? "blue" : "green"}>
              {row.original.inProgress ? "On going" : "Completed"}
            </Badge>
          </div>
        );
      },
      size: 0,
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
      accessorKey: "actualStart",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actual Start" />
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
      accessorKey: "odometerStart",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Initial Odometer Reading"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.odometerStart}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "odometerEnd",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Final Odometer Reading" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.odometerEnd}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "totalDistanceTravelled",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Distance Travelled" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.totalDistanceTravelled}
            </P>
          </div>
        );
      },
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
