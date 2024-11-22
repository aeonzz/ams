"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { cn, getSupplyStatusColor, textTransform } from "@/lib/utils";
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
import { usePathname } from "next/navigation";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { type SupplyItemType } from "@/lib/types/item";
import { updateInventory } from "@/lib/actions/inventory";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleMinus,
  CirclePlus,
  Dot,
  RotateCw,
} from "lucide-react";
import { format, formatDate } from "date-fns";
import { PhotoProvider, PhotoView } from "react-photo-view";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { UpdateSupplyItemSheet } from "./update-supply-item-sheet";
import { DeleteSuppyItemDialog } from "./delete-supply-item-dialog";
import { updateSupplyItemStatuses } from "@/lib/actions/supply";
import { toast } from "sonner";
import SupplyItemStatusSchema, {
  SupplyItemStatusType,
} from "prisma/generated/zod/inputTypeSchemas/SupplyItemStatusSchema";
import NumberFlow from "@number-flow/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type SupplyItemColumnProps = {
  queryKey?: string[];
  removeField?: boolean;
};

export function getSupllyItemColumns(
  props: SupplyItemColumnProps
): ColumnDef<SupplyItemType>[] {
  const { queryKey, removeField = false } = props;
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
      accessorKey: "stockNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock Number" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.stockNumber}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{row.original.categoryName}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deparment" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">
              {row.original.departmentName}
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
        const status = getSupplyStatusColor(row.original.status);
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <HoverCard>
              <HoverCardTrigger>
                <P className="truncate font-medium">
                  {row.original.description ? row.original.description : "-"}
                </P>
              </HoverCardTrigger>
              <HoverCardContent className="flex flex-col">
                <p>
                  {row.original.description ? row.original.description : "-"}
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <NumberFlow
              willChange
              continuous
              value={row.original.quantity}
              format={{ useGrouping: false }}
              aria-hidden
            />
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "unitValue",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit Value" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            ₱{" "}
            <NumberFlow
              willChange
              continuous
              value={row.original.unitValue}
              format={{ useGrouping: false }}
              aria-hidden
            />
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            ₱{" "}
            <NumberFlow
              willChange
              continuous
              value={row.original.total}
              format={{ useGrouping: false }}
              aria-hidden
            />
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.unit}</P>
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "lowStockThreshold",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Low Stock Threshold" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <NumberFlow
              willChange
              continuous
              value={row.original.lowStockThreshold}
              format={{ useGrouping: false }}
              aria-hidden
            />
          </div>
        );
      },
      size: 0,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location/Whereabouts" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.location}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "expirationDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expiry" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {cell.getValue() ? format(cell.getValue() as Date, "PP") : "-"}
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
          updateSupplyItemStatuses
        );

        React.useEffect(() => {
          if (showUpdateTaskSheet) {
            dialogManager.setActiveDialog("adminUpdateInventoryItemSheet");
          } else {
            dialogManager.setActiveDialog(null);
          }
        }, [showUpdateTaskSheet]);

        return (
          <div className="grid place-items-center">
            <UpdateSupplyItemSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              queryKey={queryKey}
              removeField={removeField}
              item={row.original}
            />
            <DeleteSuppyItemDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              items={[row.original]}
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
                            ids: [row.original.id],
                            status: value as SupplyItemStatusType,
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
                      {SupplyItemStatusSchema.options.map((option) => {
                        const status = getSupplyStatusColor(option);
                        return (
                          <DropdownMenuRadioItem
                            key={option}
                            value={option}
                            className="capitalize"
                            disabled={isPending}
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
