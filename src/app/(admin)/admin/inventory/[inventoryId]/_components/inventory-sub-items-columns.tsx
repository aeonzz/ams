"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import type { InventorySubItemType } from "@/lib/types/item";
import { updateInventorySubItem } from "@/lib/actions/inventoryItem";
import ItemStatusSchema, {
  type ItemStatusType,
} from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";
import { format, formatDate } from "date-fns";
import { UpdateInventorySubItemSheet } from "./update-sub-inventory-item-sheet";

export function getInventorySubItemsColumns(): ColumnDef<InventorySubItemType>[] {
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
      accessorKey: "imageUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-square h-10 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={row.original.imageUrl}
                    alt={`Image of ${row.original.name}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="aspect-square min-h-[80vh] max-w-2xl">
                <Image
                  src={row.original.imageUrl}
                  alt={`Image of ${row.original.name}`}
                  fill
                  className="rounded-md border object-cover"
                />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      enableSorting: false,
      size: 0,
    },
    {
      accessorKey: "subName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[20vw] space-x-2">
            <P className="truncate font-medium">{row.original.subName}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "serialNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Serial Number" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.serialNumber ? row.original.serialNumber : "-"}
            </P>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { icon: Icon, variant } = getReturnableItemStatusIcon(
          row.original.status
        );
        return (
          <div className="flex items-center">
            <Badge variant={variant}>
              <Icon className="mr-1 size-4" />
              {textTransform(row.original.status)}
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
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP")}
          </P>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
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
    {
      id: "actions",
      cell: function Cell({ row }) {
        const dialogManager = useDialogManager();
        const pathname = usePathname();
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        const { isPending, mutateAsync } = useServerActionMutation(
          updateInventorySubItem
        );

        React.useEffect(() => {
          if (showUpdateTaskSheet) {
            dialogManager.setActiveDialog("adminUpdateInventorySubItemDialog");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showUpdateTaskSheet]);
        
        return (
          <div className="grid place-items-center">
          <UpdateInventorySubItemSheet
            open={showUpdateTaskSheet}
            onOpenChange={setShowUpdateTaskSheet}
            inventory={row.original}
          />
            {/* <DeleteEquipmentsDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              equipments={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
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
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.status}
                      onValueChange={(value) => {
                        toast.promise(
                          mutateAsync({
                            id: row.original.id,
                            status: value as ItemStatusType,
                            path: pathname,
                          }),
                          {
                            loading: "Updating status...",
                            success: () => {
                              return "Status updated successfully";
                            },
                            error: (err) => {
                              console.log(err);
                              return err.message;
                            },
                          }
                        );
                      }}
                    >
                      {ItemStatusSchema.options.map((status) => {
                        const { icon: Icon, variant } =
                          getReturnableItemStatusIcon(status);
                        return (
                          <DropdownMenuRadioItem
                            key={status}
                            value={status}
                            className="capitalize"
                            disabled={isPending}
                          >
                            <Badge variant={variant}>
                              <Icon className="mr-1 size-4" />
                              {textTransform(status)}
                            </Badge>
                          </DropdownMenuRadioItem>
                        );
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
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
