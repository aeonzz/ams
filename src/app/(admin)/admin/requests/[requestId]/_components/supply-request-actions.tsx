"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { supplyRequestActions } from "@/lib/actions/supply";
import { UpdateSupplyResourceRequestSchemaWithPath } from "@/lib/schema/resource/supply-resource";

interface SupplyRequestActionsProps {
  requestId: string;
}

export default function SupplyRequestActions({
  requestId,
}: SupplyRequestActionsProps) {
  const pathname = usePathname();
  const { mutateAsync, isPending } =
    useServerActionMutation(supplyRequestActions);

  const handleUpdate = async () => {
    const data: UpdateSupplyResourceRequestSchemaWithPath = {
      path: pathname,
      id: requestId,
    };

    toast.promise(mutateAsync(data), {
      loading: "Marking as picked up...",
      success: () => {
        return "The supply has been successfully marked as fulfilled and received by the recipient!";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending}>Mark as Picked Up</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Pickup</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this item as picked up?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate} disabled={isPending}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
