"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { P } from "@/components/typography/text";
import { usePathname } from "next/navigation";
import { UpdateDepartmentSheet } from "./update-department-sheet";
import { DeleteDepartmentsDialog } from "./delete-departments-dialog";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import type { DepartmentsTableType } from "./types";
import { formatDate } from "date-fns";
import { textTransform } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function getDepartmentsColumns(): ColumnDef<DepartmentsTableType>[] {
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
      size: 0,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="id" />
    //   ),
    //   cell: ({ row }) => <P>{row.getValue("id")}</P>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.name}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "departmentType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{textTransform(row.original.departmentType)}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.description ? row.original.description : "-"}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "acceptsJobs",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Accepts Jobs" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant={row.original.acceptsJobs ? "green" : "red"}>
              {row.original.acceptsJobs ? "Yes" : "No"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "responsibilities",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsibilities" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.responsibilities
                ? row.original.responsibilities
                : "-"}
            </P>
          </div>
        );
      },
    },
    {
      id: "expander",
      header: () => <P>Users</P>,
      cell: ({ row }) => {
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => row.toggleExpanded()}
            aria-label="Toggle row details"
          >
            {row.getIsExpanded() ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
        );
      },
      size: 0,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date, "PPP p"),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date, "PPP p"),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const pathname = usePathname();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        return (
          <div className="grid place-items-center">
            <UpdateDepartmentSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              department={row.original}
            />
            <DeleteDepartmentsDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              departments={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                  className="focus:bg-destructive focus:text-destructive-foreground"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 40,
    },
  ];
}
