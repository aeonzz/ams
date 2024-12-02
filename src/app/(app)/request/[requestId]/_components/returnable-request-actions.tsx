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
  const [lostReason, setLostReason] = React.useState("");
  const { mutateAsync, isPending } = useServerActionMutation(
    returnableResourceActions
  );
  const [returnCondition, setReturnCondition] = React.useState("");

  async function handleUpdate(values: {
    itemStatus: ItemStatusType;
    isReturned?: boolean;
    returnCondition?: string;
    inProgress: boolean;
    isLost?: boolean;
    lostReason?: string;
  }) {
    const data: UpdateReturnableResourceRequestSchemaWithPath = {
      path: pathname,
      id: requestId,
      itemStatus: values.itemStatus,
      returnCondition: values.returnCondition,
      isReturned: values.isReturned,
      inProgress: values.inProgress,
      isLost: values.isLost,
      lostReason: values.lostReason,
    };

    toast.promise(mutateAsync(data), {
      loading: "Loading...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: [requestId] });
        if (values.isLost) {
          return "The item has been marked as lost.";
        }
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
      {request.item.status !== "IN_USE" && (
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
                onClick={() =>
                  handleUpdate({
                    itemStatus: "IN_USE",
                    inProgress: true,
                    isLost: false,
                  })
                }
                disabled={isPending}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {request.inProgress && request.item.status === "IN_USE" && (
        <>
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
              <div className="mb-4">
                <Label htmlFor="returnCondition" className="mb-2 block">
                  Return Condition <span className="text-red-500">*</span>
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
                      inProgress: false,
                      isLost: false,
                    })
                  }
                  disabled={isPending || !returnCondition.trim()}
                >
                  Confirm Return
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                Mark as Lost
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Item as Lost</AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide details about how the item was lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mb-4">
                <Label htmlFor="lostReason" className="mb-2 block">
                  Lost Detailst <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="lostReason"
                  maxRows={6}
                  minRows={3}
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  placeholder="Describe how the item was lost..."
                  className="text-sm placeholder:text-sm"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    handleUpdate({
                      itemStatus: "LOST",
                      isReturned: false,
                      inProgress: false,
                      lostReason,
                      isLost: true,
                    })
                  }
                  disabled={isPending || !lostReason.trim()}
                >
                  Confirm Lost
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </PermissionGuard>
  );
}
