"use client";

import { SupplyRequestItemWithRelations } from "prisma/generated/zod";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CircleMinus, CirclePlus, Dot, RotateCw, X } from "lucide-react";
import { getSupplyStatusColor, textTransform } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/number-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { H4, P } from "@/components/typography/text";
import { CommandShortcut } from "@/components/ui/command";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  updateRequestSupplyItem,
  deleteRequestSupplyItem,
} from "@/lib/actions/resource";
import { toast } from "sonner";
import { socket } from "@/app/socket";
import { usePathname } from "next/navigation";
import { PhotoProvider, PhotoView } from "react-photo-view";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SupplyRequestItemCardProps {
  item: SupplyRequestItemWithRelations;
  canEdit: boolean;
  editField: string | null;
  setEditField: (editField: string | null) => void;
  itemsCount: number;
}

export default function SupplyRequestItemCard({
  item,
  canEdit,
  editField,
  setEditField,
  itemsCount,
}: SupplyRequestItemCardProps) {
  const pathname = usePathname();
  const status = getSupplyStatusColor(item.supplyItem.status);
  const [quantity, setQuantity] = useState(item.quantity);
  const isEditing = editField === item.id;

  const { mutateAsync: updateItem, isPending: isUpdating } =
    useServerActionMutation(updateRequestSupplyItem);
  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useServerActionMutation(deleteRequestSupplyItem);

  async function handleEdit() {
    toast.promise(
      updateItem({
        id: item.id,
        path: pathname,
        quantity,
      }),
      {
        loading: "Saving...",
        success: () => {
          socket.emit("request_update");
          setEditField(null);
          return "Request updated successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  }

  async function handleDelete() {
    if (itemsCount === 1) {
      return toast.error("You must have at least one item.");
    }
    toast.promise(
      deleteItem({
        id: item.id,
        path: pathname,
      }),
      {
        loading: "Deleting...",
        success: () => {
          socket.emit("request_update");
          setEditField(null);
          return "Item deleted successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  }

  return (
    <Card className="group bg-secondary">
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex">
          <div className="flex flex-1">
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
              <PhotoView
                key={item.supplyItem.id}
                src={item.supplyItem.imageUrl}
              >
                <div className="relative mr-2 aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={item.supplyItem.imageUrl}
                    alt={`Image of ${item.supplyItem.name}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
              </PhotoView>
            </PhotoProvider>
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="truncate text-lg font-semibold">
                  {item.supplyItem.name}
                </h4>
                <p className="line-clamp-2 text-sm leading-none text-muted-foreground">
                  {item.supplyItem.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <P className="font-semibold">
              {item.quantity}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                {item.supplyItem.unit}
              </span>
            </P>
            {canEdit && !isEditing && (
              <Button
                variant="link"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  setEditField(item.id);
                }}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-3">
                <Badge variant={status.variant} className="w-fit pr-3.5">
                  <Dot
                    className="mr-1 size-3"
                    strokeWidth={status.stroke}
                    color={status.color}
                  />
                  {textTransform(item.supplyItem.status)}
                </Badge>
                <div className="ml-auto inline-flex items-center gap-2 text-lg font-medium">
                  <span className="text-xs text-muted-foreground">
                    Inventory:{" "}
                  </span>
                  <H4 className="font-semibold">
                    {item.supplyItem.quantity}{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.supplyItem.unit}
                    </span>
                  </H4>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`quantity-${item.supplyItemId}`}>
                    Quantity{" "}
                    <span className="text-xs text-muted-foreground">
                      ({item.supplyItem.unit})
                    </span>
                    :
                  </Label>
                  <NumberInput
                    value={quantity}
                    min={1}
                    max={item.supplyItem.quantity || 30}
                    onChange={(value) => setQuantity(value)}
                    className="w-fit"
                  />
                </div>
                <Tooltip>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost2"
                          size="icon"
                          className="border"
                          disabled={isUpdating || isDeleting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the item from your supply request.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete()}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <TooltipContent>Remove item</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="sm"
                    disabled={isUpdating || isDeleting}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField(null);
                    }}
                  >
                    Cancel
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-3">
                  <P>Exit</P>
                  <CommandShortcut>Esc</CommandShortcut>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={
                      isUpdating || isDeleting || quantity === item.quantity
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit();
                    }}
                  >
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-3">
                  <P>Save</P>
                  <div className="space-x-1">
                    <CommandShortcut>Shift</CommandShortcut>
                    <CommandShortcut>Enter</CommandShortcut>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
