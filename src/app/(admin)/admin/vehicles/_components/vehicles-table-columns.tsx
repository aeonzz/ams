"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  getPriorityIcon,
  getVehicleStatusColor,
  textTransform,
} from "@/lib/utils";
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
import VehicleStatusSchema, {
  type VehicleStatusType,
} from "prisma/generated/zod/inputTypeSchemas/VehicleStatusSchema";
import { updateVehicle } from "@/lib/actions/vehicle";
import { UpdateVehicleSheet } from "./update-vehicle-sheet";
import { DeleteVehiclesDialog } from "./delete-vehicles-dialog";
import { formatDate } from "date-fns";
import type { VehicleTableType } from "./types";
import { Dot } from "lucide-react";

export function getVehiclesColumns(): ColumnDef<VehicleTableType>[] {
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
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.type}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capacity" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.capacity}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "licensePlate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="License" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.licensePlate}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="status" />
      ),
      cell: ({ row }) => {
        const status = getVehicleStatusColor(row.original.status);
        return (
          <div className="flex items-center">
            <Badge variant={status.variant} className="pr-3.5">
              <Dot
                className="mr-1 size-3"
                strokeWidth={status.stroke}
                color={status.color}
              />
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
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Manage By" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.departmentName}</P>
          </div>
        );
      },
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
        <DataTableColumnHeader column={column} title="Date Modified" />
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

        const { isPending, mutateAsync } =
          useServerActionMutation(updateVehicle);

        return (
          <div className="grid place-items-center">
            <UpdateVehicleSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              vehicle={row.original}
            />
            <DeleteVehiclesDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              vehicles={[row.original]}
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.status}
                      onValueChange={(value) => {
                        toast.promise(
                          mutateAsync({
                            id: row.original.id,
                            status: value as VehicleStatusType,
                            path: pathname,
                            changeType: "STATUS_CHANGE",
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
                      {VehicleStatusSchema.options.map((option) => {
                        const status = getVehicleStatusColor(option);
                        return (
                          <DropdownMenuRadioItem
                            key={option}
                            value={option}
                            className="capitalize"
                            disabled={isPending}
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Badge variant={status.variant} className="pr-3.5">
                              <Dot
                                className="mr-1 size-3"
                                strokeWidth={status.stroke}
                                color={status.color}
                              />
                              {textTransform(option)}
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
