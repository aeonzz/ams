"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
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
import { usePathname } from "next/navigation";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { updateInventorySubItem } from "@/lib/actions/inventoryItem";
import { UpdateJobSectionSheet } from "./update-job-section-sheet";
import { DeleteJobSectionsDialog } from "./delete-job-sections-dialog";
import type { JobSectionData } from "./types";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export function getJobSectionsColumns(): ColumnDef<JobSectionData>[] {
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
        <DataTableColumnHeader column={column} title="description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.description ? row.original.description : "N/A"}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
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
      id: "actions",
      cell: function Cell({ row }) {
        const dialogManager = useDialogManager();
        const pathname = usePathname();
        const [showUpdateJobSectionSheet, setShowUpdateJobSectionSheet] =
          React.useState(false);
        const [showDeleteJobSectionDialog, setShowDeleteJobSectionDialog] =
          React.useState(false);

        const { isPending, mutateAsync } = useServerActionMutation(
          updateInventorySubItem
        );

        React.useEffect(() => {
          if (showUpdateJobSectionSheet) {
            dialogManager.setActiveDialog("adminUpdateJobSectionSheet");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showUpdateJobSectionSheet]);

        return (
          <div className="grid place-items-center">
            <UpdateJobSectionSheet
              open={showUpdateJobSectionSheet}
              onOpenChange={setShowUpdateJobSectionSheet}
              jobSection={row.original}
            />
            <DeleteJobSectionsDialog
              open={showDeleteJobSectionDialog}
              onOpenChange={setShowDeleteJobSectionDialog}
              jobSections={[row.original]}
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
                <DropdownMenuItem
                  onSelect={() => setShowUpdateJobSectionSheet(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteJobSectionDialog(true)}
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
