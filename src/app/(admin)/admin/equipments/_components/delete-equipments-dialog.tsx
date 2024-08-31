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
import { type ReturnableItem } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { deleteEquipments } from "@/lib/actions/item";

interface DeleteEquipmentsDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  equipments: Row<ReturnableItem>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteEquipmentsDialog({
  equipments,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteEquipmentsDialogProps) {
  const pathname = usePathname();
  const { isPending, mutateAsync } = useServerActionMutation(deleteEquipments);
  function onDelete() {
    toast.promise(
      mutateAsync({
        ids: equipments.map((equipment) => equipment.id),
        path: pathname,
      }),
      {
        loading: "Deleting...",
        success: () => {
          onSuccess?.();
          return "Equipment/s deleted successfully";
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
              Delete ({equipments.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent bgOpacity="bg-black/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{equipments.length}</span>
              {equipments.length === 1 ? " equipment" : " equipments"} and all
              related records from our servers.
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
