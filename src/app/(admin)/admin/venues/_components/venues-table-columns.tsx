"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { getVenueStatusColor, textTransform } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { VenueStatusSchema } from "prisma/generated/zod";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateVenue } from "@/lib/actions/venue";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { type VenueStatusType } from "prisma/generated/zod/inputTypeSchemas/VenueStatusSchema";
import { UpdateVenueSheet } from "./update-venue-sheet";
import { DeleteVenuesDialog } from "./delete-venues-dialog";
import { formatDate } from "date-fns";
import type { VenueTableType } from "./types";
import { VenueFeaturesType } from "@/lib/types/venue";
import { Dot } from "lucide-react";

export function getVenuesColumns(): ColumnDef<VenueTableType>[] {
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
              <DialogContent className="aspect-square w-[80vw]">
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
      accessorKey: "venueType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">
              {textTransform(row.original.venueType)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "features",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Features" />
      ),
      cell: ({ row }) => {
        const features = row.original.features as VenueFeaturesType[];
        if (!features || features.length === 0) {
          return <P className="text-muted-foreground">No features</P>;
        }

        return (
          <div className="flex flex-wrap">
            {features.map((feature, index) => (
              <P key={index}>
                {feature.name}
                {features.length - 1 !== index && ", "}
              </P>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.location}</P>
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = getVenueStatusColor(row.original.status);
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
        const [showUpdateVenueSheet, setShowUpdateVenueSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        const { isPending, mutateAsync } = useServerActionMutation(updateVenue);

        return (
          <div className="grid place-items-center">
            <UpdateVenueSheet
              open={showUpdateVenueSheet}
              onOpenChange={setShowUpdateVenueSheet}
              venue={row.original}
            />
            <DeleteVenuesDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              venues={[row.original]}
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
                  onSelect={() => setShowUpdateVenueSheet(true)}
                >
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
                            status: value as VenueStatusType,
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
                      {VenueStatusSchema.options.map((status) => {
                        const value = getVenueStatusColor(status);
                        return (
                          <DropdownMenuRadioItem
                            key={status}
                            value={status}
                            className="capitalize"
                            disabled={isPending}
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Badge variant={value.variant} className="pr-3.5">
                              <Dot
                                className="mr-1 size-3"
                                strokeWidth={value.stroke}
                                color={value.color}
                              />
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
