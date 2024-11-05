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
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";

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
  const [returnCondition, setReturnCondition] = React.useState("");

  async function handleUpdate(values: {
    itemStatus: ItemStatusType;
    isReturned?: boolean;
    returnCondition?: string;
  }) {
    const data: UpdateReturnableResourceRequestSchemaWithPath = {
      path: pathname,
      id: requestId,
      itemStatus: values.itemStatus,
      returnCondition: values.returnCondition,
      isReturned: values.isReturned,
    };

    toast.promise(mutateAsync(data), {
      loading: "Loading...",
      success: () => {
        socket.emit("request_update");
        socket.emit("notifications");
        return values.itemStatus === "IN_USE"
          ? "The item has been successfully marked as picked up."
          : "The item has been successfully marked as returned.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <>
      {request.inProgress && request.item.status !== "IN_USE" && (
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
                onClick={() => handleUpdate({ itemStatus: "IN_USE" })}
                disabled={isPending}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {request.inProgress && request.item.status === "IN_USE" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isPending}>Mark as Returned</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Item as Returned</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide the return condition of the item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div>
              <Label htmlFor="returnCondition" className="text-right">
                Return Condition
              </Label>
              <Textarea
                id="returnCondition"
                maxRows={6}
                minRows={3}
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
                placeholder="Describe the condition of the returned item..."
                className="text-sm placeholder:text-sm"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleUpdate({
                    itemStatus: "AVAILABLE",
                    isReturned: true,
                    returnCondition,
                  })
                }
                disabled={isPending || !returnCondition.trim()}
              >
                Confirm Return
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
