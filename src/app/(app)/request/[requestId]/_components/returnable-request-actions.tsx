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
import type { ReturnableRequestWithRelations } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { useQueryClient } from "@tanstack/react-query";
import { PermissionGuard } from "@/components/permission-guard";
import { useSession } from "@/lib/hooks/use-session";

interface ReturnableRequestActionsProps {
  requestId: string;
  request: ReturnableRequestWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
}

export default function ReturnableRequestActions({
  requestId,
  request,
  allowedRoles,
  allowedDepartment,
}: ReturnableRequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentUser = useSession();
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
        queryClient.invalidateQueries({ queryKey: [requestId] });
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
    <PermissionGuard
      allowedRoles={allowedRoles}
      allowedDepartment={allowedDepartment}
      currentUser={currentUser}
    >
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
    </PermissionGuard>
  );
}
