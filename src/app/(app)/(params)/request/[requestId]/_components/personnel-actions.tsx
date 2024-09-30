"use client";

import React from "react";
import { PermissionGuard } from "@/components/permission-guard";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateJobRequest } from "@/lib/actions/job";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import type { JobRequestWithRelations } from "prisma/generated/zod";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { type JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";

interface PersonnelActionsProps {
  allowedDepartment?: string;
  allowedRoles: string[];
  requestId: string;
  data: JobRequestWithRelations;
}

export default function PersonnelActions({
  allowedRoles,
  allowedDepartment,
  requestId,
  data,
}: PersonnelActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const { isPending: isPendingMutation, mutateAsync } =
    useServerActionMutation(updateJobRequest);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      setAlertOpen(true);
    },
    { enableOnFormTags: true, enabled: data.status !== "COMPLETED" }
  );

  const handleStatusChange = async (status: JobStatusType) => {
    const now = new Date();
    toast.promise(
      mutateAsync({
        status,
        path: pathname,
        requestId,
        ...(status === "IN_PROGRESS" ? { startDate: now } : {}),
        ...(status === "COMPLETED" ? { endDate: now.toISOString() } : {}),
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [requestId] });
          queryClient.invalidateQueries({ queryKey: ["activity", requestId] });
          return `Job request is now ${status.toLowerCase().replace("_", " ")}`;
        },
        error: (err) => {
          console.error(err);
          return err.message;
        },
      }
    );
  };

  const isPending = data.status === "PENDING";
  const buttonText = isPending ? "Start Job" : "Mark as Done";
  const newStatus: JobStatusType = isPending ? "IN_PROGRESS" : "COMPLETED";
  const tooltipText = isPending ? "Start job" : "Mark this job as done";
  const dialogTitle = isPending
    ? "Confirm Job Start"
    : "Confirm Job Completion";
  const dialogDescription = isPending
    ? "Are you sure you want to begin this job? Once started, it cannot be paused or reverted. Please ensure you have the necessary resources and permissions to proceed."
    : "Are you sure you want to mark this job as done? Once marked, it will be considered complete, and no further changes can be made.";

  if (data.status === "COMPLETED") {
    return null;
  }

  return (
    <PermissionGuard
      allowedRoles={allowedRoles}
      currentUser={currentUser}
      allowedDepartment={allowedDepartment}
    >
      <TooltipProvider>
        <Tooltip>
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="secondary">{buttonText}</Button>
              </TooltipTrigger>
            </AlertDialogTrigger>
            <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <AlertDialogHeader>
                <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusChange(newStatus)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TooltipContent className="flex items-center gap-3" side="bottom">
            <P>{tooltipText}</P>
            <div className="flex gap-1">
              <CommandShortcut>Ctrl</CommandShortcut>
              <CommandShortcut>S</CommandShortcut>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PermissionGuard>
  );
}
