"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateRequestStatus } from "@/lib/actions/job";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type EntityTypeType } from "prisma/generated/zod/inputTypeSchemas/EntityTypeSchema";
import { socket } from "@/app/socket";

interface RequestApproverActionsProps {
  request: RequestWithRelations;
  isPending: boolean;
  entityType: EntityTypeType;
}

export default function RequestApproverActions({
  request,
  isPending,
  entityType,
}: RequestApproverActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  console.log(request);
  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateRequestStatus);

  const handleReview = React.useCallback(
    (action: "APPROVED" | "REJECTED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        status: action,
        changeType: action === "APPROVED" ? "APPROVED" : "APPROVER_CHANGE",
        entityType: entityType,
      };

      const actionText =
        action === "APPROVED" ? "Finalizing approval of" : "Rejecting";
      const successText = action === "APPROVED" ? "finalized" : "rejected";

      toast.promise(updateStatusMutate(data), {
        loading: `${actionText} request...`,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [request.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["activity", request.id],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "get-user-notifications",
              request.jobRequest?.assignedTo,
            ],
          });
          socket.emit("request_update", request.id);
          socket.emit("notifications");
          return `Request ${successText} successfully.`;
        },
        error: (err) => {
          console.error(err);
          return `Failed to ${action.toLowerCase()} request. Please try again.`;
        },
      });
    },
    [pathname, request.id, updateStatusMutate, queryClient, currentUser.id]
  );

  return (
    <div className="flex space-x-2">
      <Button
        variant="destructive"
        disabled={isUpdateStatusPending || isPending}
        onClick={() => handleReview("REJECTED")}
        className="flex-1"
      >
        Reject
      </Button>
      <Button
        disabled={isUpdateStatusPending || isPending}
        onClick={() => handleReview("APPROVED")}
        className="flex-1"
      >
        Finalize Approval
      </Button>
    </div>
  );
}
