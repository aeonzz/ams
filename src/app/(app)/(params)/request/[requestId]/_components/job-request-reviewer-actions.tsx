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
  const [optimisticStatus, setOptimisticStatus] =
    useState<RequestStatusType | null>(null);

  const { mutateAsync, isPending } = useServerActionMutation(
    updateRequestStatus,
    {
      onMutate: async (newStatus) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: [request.id] });

        // Snapshot the previous value
        const previousRequest = queryClient.getQueryData([request.id]);

        // Optimistically update to the new value
        queryClient.setQueryData(
          [request.id],
          (old: RequestWithRelations | undefined) => {
            if (!old) return old;
            return { ...old, status: newStatus.status };
          }
        );

        setOptimisticStatus(newStatus.status);

        // Return a context object with the snapshotted value
        return { previousRequest };
      },
      onError: (err, newStatus, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        //@ts-ignore
        queryClient.setQueryData([request.id], context?.previousRequest);
        setOptimisticStatus(null);
      },
      onSettled: () => {
        // Always refetch after error or success to ensure we have the latest data
        queryClient.invalidateQueries({ queryKey: [request.id] });
        setOptimisticStatus(null);
      },
    }
  );

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
      success: `Job request ${successText} successfully.`,
      error: (err) => {
        console.error(err);
        return `Failed to ${action.toLowerCase()} job request. Please try again.`;
      },
    });
  };

  const currentStatus = optimisticStatus || request.status;

  return (
    <div className="space-y-4">
      <Button
        onClick={() => dialogManager.setActiveDialog("jobDetailsDialog")}
        className="w-full"
        variant="secondary"
        disabled={currentStatus !== "PENDING"}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {request.jobRequest?.assignedTo
          ? "Reassign Personnel"
          : "Assign Personnel"}
      </Button>
      {currentStatus === "PENDING" && (
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
