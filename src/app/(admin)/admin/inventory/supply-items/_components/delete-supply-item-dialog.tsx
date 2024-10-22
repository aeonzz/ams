"use client";

import * as React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import type { SupplyItemType } from "@/lib/types/item";
import { deleteInventorySubItems } from "@/lib/actions/inventoryItem";
import { deleteSupplyItems } from "@/lib/actions/supply";

interface DeleteSuppyItemDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  items: Row<SupplyItemType>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteSuppyItemDialog({
  items,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteSuppyItemDialogProps) {
  const pathname = usePathname();
  const { isPending, mutateAsync } = useServerActionMutation(deleteSupplyItems);
  function onDelete() {
    toast.promise(
      mutateAsync({
        ids: items.map((inventory) => inventory.id),
        path: pathname,
      }),
      {
        loading: "Deleting...",
        success: () => {
          onSuccess?.();
          return "Item/s deleted successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  }

  return (
    <>
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete ({items.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent bgOpacity="bg-black/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{items.length}</span>
              {items.length === 1 ? " item" : "items"} and all related records
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
