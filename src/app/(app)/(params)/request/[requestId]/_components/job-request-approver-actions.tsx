"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateJobRequestStatus } from "@/lib/actions/job";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatFullName } from "@/lib/utils";
import { P } from "@/components/typography/text";

interface JobRequestApproverActionsProps {
  request: RequestWithRelations;
  isPending: boolean;
}

export default function JobRequestApproverActions({
  request,
  isPending,
}: JobRequestApproverActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { jobRequest } = request;

  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateJobRequestStatus);

  const handleReview = React.useCallback(
    (action: "APPROVED" | "REJECTED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        status: action,
        changeType: action === "APPROVED" ? "APPROVED" : "APPROVER_CHANGE",
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
            queryKey: [request.jobRequest?.id],
          });
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
    <div className="flex flex-col gap-3">
      {jobRequest?.reviewer && (
        <div>
          <P className="text-xs text-muted-foreground">Reviewed By:</P>
          <div className="flex w-full items-center p-2">
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage
                src={jobRequest?.reviewer.profileUrl ?? ""}
                alt={formatFullName(
                  jobRequest?.reviewer.firstName,
                  jobRequest?.reviewer.middleName,
                  jobRequest?.reviewer.lastName
                )}
              />
              <AvatarFallback>
                {jobRequest?.reviewer.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <P className="font-medium">
                {formatFullName(
                  jobRequest?.reviewer.firstName,
                  jobRequest?.reviewer.middleName,
                  jobRequest?.reviewer.lastName
                )}
              </P>
              <P className="text-sm text-muted-foreground">
                {jobRequest?.reviewer.section?.name}
              </P>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}
