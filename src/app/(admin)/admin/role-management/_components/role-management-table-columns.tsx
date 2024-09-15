"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import type { RoleType } from "@/lib/types/role";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import AssignRoleSheet from "./assign-role-sheet";
import { UpdateRoleSheet } from "./update-role-sheet";
import { DeleteRolesDialog } from "./delete-roles-dialog";
import AssignUserRoleRowPopover from "./assign-user-role-row-popover";
import type { RoleTableType } from "./types";
import { formatDate } from "date-fns";

export function getRoleColumns(): ColumnDef<RoleTableType>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.name}</P>
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
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.description}</P>
          </div>
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
      size: 0,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date, "PPP p"),
      size: 0,
    },
    {
      id: "expander",
      header: () => <P>User Roles</P>,
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
      id: "actions",
      cell: function Cell({ row }) {
        const dialogManager = useDialogManager();
        const pathname = usePathname();
        const [showUpdateRoleSheet, setShowUpdateRoleSheet] =
          React.useState(false);
        const [showDeleteRoleDialog, setShowDeleteRoleDialog] =
          React.useState(false);
        const [showAssignRoleSheet, setShowAssignRoleSheet] =
          React.useState(false);

        React.useEffect(() => {
          if (showUpdateRoleSheet) {
            dialogManager.setActiveDialog("adminUpdateRoleSheet");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showUpdateRoleSheet]);

        React.useEffect(() => {
          if (showDeleteRoleDialog) {
            dialogManager.setActiveDialog("adminDeleteRoleDialog");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showDeleteRoleDialog]);

        return (
          <div className="grid place-items-center">
            <UpdateRoleSheet
              open={showUpdateRoleSheet}
              onOpenChange={setShowUpdateRoleSheet}
              role={row.original}
            />
            <DeleteRolesDialog
              open={showDeleteRoleDialog}
              onOpenChange={setShowDeleteRoleDialog}
              roles={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            {/* <AssignRoleSheet
              roleId={row.original.id}
              roleName={row.original.name}
              open={showAssignRoleSheet}
              onOpenChange={setShowAssignRoleSheet}
            /> */}
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
                <DropdownMenuItem onSelect={() => setShowUpdateRoleSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <AssignUserRoleRowPopover roleId={row.original.id} />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteRoleDialog(true)}
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
