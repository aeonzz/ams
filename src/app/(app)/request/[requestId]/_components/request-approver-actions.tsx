"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateRequestStatus } from "@/lib/actions/job";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { useQueryClient } from "@tanstack/react-query";

interface RequestApproverActionsProps {
  request: RequestWithRelations;
  isPending: boolean;
}

export default function RequestApproverActions({
  request,
  isPending,
}: RequestApproverActionsProps) {
  const currentUser = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateRequestStatus);

  const handleReview = React.useCallback(
    (action: "APPROVED" | "REJECTED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        status: action,
      };

      const actionText =
        action === "APPROVED" ? "Approving" : "Rejecting";
      const successText = action === "APPROVED" ? "approved" : "rejected";

      toast.promise(updateStatusMutate(data), {
        loading: `${actionText} request...`,
        success: () => {
          queryClient.invalidateQueries({ queryKey: [request.id] });
          return `Request ${successText} successfully.`;
        },
        error: (err) => {
          console.error(err);
          return `Failed to ${action.toLowerCase()} request. Please try again.`;
        },
      });
    },
    [pathname, request.id, updateStatusMutate, currentUser.id]
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
        Approve
      </Button>
    </div>
  );
}
