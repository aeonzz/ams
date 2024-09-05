"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { cn, formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import Link from "next/link";
import { updateInventory } from "@/lib/actions/inventory";
import type { RoleType } from "@/lib/types/role";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import AssignRoleSheet from "./assign-role-sheet";

export function getRoleColumns(): ColumnDef<RoleType>[] {
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
          <div className="flex w-[20vw] space-x-2">
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
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
      size: 0,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
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
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);
        const [showAssignRoleSheet, setShowAssignRoleSheet] =
          React.useState(false);

        const { isPending, mutateAsync } =
          useServerActionMutation(updateInventory);

        React.useEffect(() => {
          if (showAssignRoleSheet) {
            dialogManager.setActiveDialog("adminAssignRoleSheet");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showUpdateTaskSheet]);

        return (
          <div className="grid place-items-center">
            <AssignRoleSheet
              roleId={row.original.id}
              roleName={row.original.name}
              isPending={isPending}
              open={showAssignRoleSheet}
              onOpenChange={setShowAssignRoleSheet}
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
                <DropdownMenuItem onSelect={() => setShowAssignRoleSheet(true)}>
                  Assign
                </DropdownMenuItem>
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
