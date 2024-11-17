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
import { format, formatDate } from "date-fns";
import type { VehicleTableType } from "./types";
import { CircleMinus, CirclePlus, Dot, RotateCw } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import LoadingSpinner from "@/components/loaders/loading-spinner";

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
            <PhotoProvider
              speed={() => 300}
              maskOpacity={0.8}
              loadingElement={<LoadingSpinner />}
              toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                return (
                  <>
                    <div className="flex gap-3">
                      <CirclePlus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale + 1)}
                      />
                      <CircleMinus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale - 1)}
                      />
                      <RotateCw
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onRotate(rotate + 90)}
                      />
                    </div>
                  </>
                );
              }}
            >
              <div>
                <PhotoView src={row.original.imageUrl}>
                  <div className="relative aspect-square h-10 cursor-pointer transition-colors hover:brightness-75">
                    <Image
                      src={row.original.imageUrl}
                      alt={`Image of ${row.original.name}`}
                      fill
                      className="rounded-md border object-cover"
                    />
                  </div>
                </PhotoView>
              </div>
            </PhotoProvider>
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
          <div className="flex space-x-2">
            <NumberFlow
              willChange
              continuous
              value={row.original.capacity}
              format={{ useGrouping: false }}
              aria-hidden
            />
          </div>
        );
      },
    },
    {
      accessorKey: "odometer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Odometer" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <NumberFlow
              willChange
              continuous
              value={row.original.odometer}
              format={{ useGrouping: false }}
              aria-hidden
            />
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
        <DataTableColumnHeader column={column} title="Date Modified" />
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
