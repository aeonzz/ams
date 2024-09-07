"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { UserPlus } from "lucide-react";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import JobDetailsActionsDialog from "@/components/dialogs/job-details-actions-dialog";
import { RequestStatusType } from "@prisma/client";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateRequestStatus } from "@/lib/actions/job";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface JobRequestReviewerActionsProps {
  request: RequestWithRelations;
}

export default function JobRequestReviewerActions({
  request,
}: JobRequestReviewerActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const dialogManager = useDialogManager();
  const { mutateAsync, isPending } =
    useServerActionMutation(updateRequestStatus);

  const handleReview = (action: RequestStatusType) => {
    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: request.id,
      status: action,
    };

    const actionText = action === "REVIEWED" ? "Approving" : "Rejecting";
    const successText = action === "REVIEWED" ? "approved" : "rejected";

    toast.promise(mutateAsync(data), {
      loading: `${actionText} job request...`,
      success: () => {
        queryClient.invalidateQueries({
          queryKey: [request.id],
        });
        return `Job request ${successText} successfully.`;
      },
      error: (err) => {
        console.error(err);
        return `Failed to ${action.toLowerCase()} job request. Please try again.`;
      },
    });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => dialogManager.setActiveDialog("jobDetailsDialog")}
        className="w-full"
        variant="secondary"
        disabled={request.status !== "PENDING"}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {request.jobRequest?.assignedTo
          ? "Reassign Personnel"
          : "Assign Personnel"}
      </Button>
      {request.status === "PENDING" && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!request.jobRequest?.assignedTo || isPending}
                  className="flex-1"
                >
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Job Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this job request? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleReview("REVIEWED")}>
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  className="flex-1"
                >
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Job Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this job request? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleReview("REJECTED")}>
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
      <JobDetailsActionsDialog />
    </div>
  );
}
