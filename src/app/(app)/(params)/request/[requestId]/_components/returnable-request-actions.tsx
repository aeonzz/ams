"use client";

import React from "react";
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
import { returnableResourceActions } from "@/lib/actions/inventoryItem";
import { type UpdateReturnableResourceRequestSchemaWithPath } from "@/lib/schema/resource/returnable-resource";
import type { ItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { socket } from "@/app/socket";
import type { ReturnableRequestWithRelations } from "prisma/generated/zod";

interface ReturnableRequestActionsProps {
  requestId: string;
  request: ReturnableRequestWithRelations;
}

export default function ReturnableRequestActions({
  requestId,
  request,
}: ReturnableRequestActionsProps) {
  const pathname = usePathname();
  const { mutateAsync, isPending } = useServerActionMutation(
    returnableResourceActions
  );

  async function handleUpdate(status: ItemStatusType) {
    const data: UpdateReturnableResourceRequestSchemaWithPath = {
      path: pathname,
      id: requestId,
      itemStatus: status,
    };

    toast.promise(mutateAsync(data), {
      loading: "Loading...",
      success: () => {
        socket.emit("request_update");
        socket.emit("notifications");
        return "The item has been successfully marked as picked up.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <>
      {request.inProgress && (
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
              <AlertDialogAction
                onClick={() => handleUpdate("IN_USE")}
                disabled={isPending}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
