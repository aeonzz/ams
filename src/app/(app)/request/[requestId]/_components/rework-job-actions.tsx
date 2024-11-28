"use client";

import React from "react";
import { PermissionGuard } from "@/components/permission-guard";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateReworkJobRequest } from "@/lib/actions/job";
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
import type { JobRequestWithRelations, Rework } from "prisma/generated/zod";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { type JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";
import { textTransform } from "@/lib/utils";

interface ReworkJobActionsProps {
  allowedDepartment?: string;
  allowedRoles: string[];
  data: JobRequestWithRelations;
  requestId: string;
}

export default function ReworkJobActions({
  allowedRoles,
  allowedDepartment,
  data,
  requestId,
}: ReworkJobActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const { isPending: isPendingMutation, mutateAsync } = useServerActionMutation(
    updateReworkJobRequest
  );

  const latestRework = React.useMemo(() => {
    return data.reworkAttempts
      .filter((attempt: Rework) => !attempt.status)
      .sort(
        (a: Rework, b: Rework) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
  }, [data.reworkAttempts]);

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
    if (!latestRework) {
      console.error("No active rework found");
      return;
    }

    toast.promise(
      mutateAsync({
        status,
        reworkId: latestRework.id,
        //@ts-ignore
        reworkStartDate: status === "REWORK_IN_PROGRESS" ? now : undefined,
        reworkEndDate: status === "COMPLETED" ? now : undefined,
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [requestId] });
          return `Job request is now ${textTransform(status)}`;
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
      //@ts-ignore
      case "REJECTED":
        return {
          buttonText: "Restart Job",
          newStatus: "REWORK_IN_PROGRESS" as JobStatusType,
          tooltipText: "Restart this job for rework",
          dialogTitle: "Confirm Job Restart",
          dialogDescription:
            "Are you sure you want to restart this job for rework? This will change the status to 'Rework in Progress'.",
        };
        //@ts-ignore
      case "REWORK_IN_PROGRESS":
        return {
          buttonText: "Mark as Done",
          newStatus: "COMPLETED" as JobStatusType,
          tooltipText: "Mark this rework as done",
          dialogTitle: "Confirm Rework Completion",
          dialogDescription:
            "Are you sure you want to mark this rework as done? Once marked, it will be considered complete, and no further changes can be made.",
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
