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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import type { JobRequestWithRelations } from "prisma/generated/zod";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { type JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";
import { socket } from "@/app/socket";

interface RegularJobActionsProps {
  allowedDepartment?: string;
  allowedRoles: string[];
  requestId: string;
  data: JobRequestWithRelations;
}

export default function RegularJobActions({
  allowedRoles,
  allowedDepartment,
  requestId,
  data,
}: RegularJobActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const { isPending: isPendingMutation, mutateAsync } =
    useServerActionMutation(updateJobRequest);

  useHotkeys(
    "mod+s",
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
        requestId: requestId,
        path: pathname,
        startDate: status === "IN_PROGRESS" ? now : undefined,
        endDate: status === "COMPLETED" ? now : undefined,
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [requestId] });
          socket.emit("request_update", requestId);
          socket.emit("notifications", requestId);
          return `Job request is now ${status.toLowerCase().replace("_", " ")}`;
        },
        error: (err) => {
          console.error(err);
          return err.message;
        },
      }
    );
  };

  const getButtonConfig = () => {
    switch (data.status) {
      case "PENDING":
        return {
          buttonText: "Start Job",
          newStatus: "IN_PROGRESS" as JobStatusType,
          tooltipText: "Start job",
          dialogTitle: "Confirm Job Start",
          dialogDescription:
            "Are you sure you want to begin this job? Once started, it cannot be paused or reverted. Please ensure you have the necessary resources and permissions to proceed.",
        };
      case "IN_PROGRESS":
        return {
          buttonText: "Mark as Done",
          newStatus: "COMPLETED" as JobStatusType,
          tooltipText: "Mark this job as done",
          dialogTitle: "Confirm Job Completion",
          dialogDescription:
            "Are you sure you want to mark this job as done? Once marked, it will be considered complete, and no further changes can be made.",
        };
      default:
        return null;
    }
  };

  const config = getButtonConfig();

  if (data.status === "COMPLETED" || !config) {
    return null;
  }

  return (
    <PermissionGuard
      allowedRoles={allowedRoles}
      currentUser={currentUser}
      allowedDepartment={allowedDepartment}
    >
      <Tooltip>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="secondary" disabled={isPendingMutation}>
                {config.buttonText}
              </Button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <AlertDialogHeader>
              <AlertDialogTitle>{config.dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {config.dialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange(config.newStatus)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TooltipContent className="flex items-center gap-3" side="bottom">
          <P>{config.tooltipText}</P>
          <div className="flex gap-1">
            <CommandShortcut>Ctrl</CommandShortcut>
            <CommandShortcut>S</CommandShortcut>
          </div>
        </TooltipContent>
      </Tooltip>
    </PermissionGuard>
  );
}