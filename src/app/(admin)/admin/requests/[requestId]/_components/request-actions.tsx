"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
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
import { type RequestWithRelations } from "prisma/generated/zod";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { useHotkeys } from "react-hotkeys-hook";
import { cancelOwnRequest } from "@/lib/actions/job";
import type { CancelOwnRequestSchema } from "./schema";
import { EntityTypeType } from "prisma/generated/zod/inputTypeSchemas/EntityTypeSchema";
import { socket } from "@/app/socket";

interface RequestActionsProps {
  data: RequestWithRelations;
  params: string;
  entityType: EntityTypeType;
}

export default function RequestActions({
  data,
  params,
  entityType,
}: RequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useServerActionMutation(cancelOwnRequest);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  function handleCancellation() {
    const values: CancelOwnRequestSchema = {
      requestId: data.id,
      path: pathname,
      status: "CANCELLED",
    };

    toast.promise(mutateAsync(values), {
      loading: "Cancelling...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: [params],
        });
        queryClient.invalidateQueries({
          queryKey: ["activity", data.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-dashboard-overview"],
        });
        socket.emit("request_update", data.id);
        setIsDialogOpen(false);
        return "Request cancelled successfully";
      },
      error: (err) => {
        console.error(err);
        // Revert optimistic update on error
        queryClient.setQueryData([params], data);
        return "Something went wrong, please try again later.";
      },
    });
  }

  useHotkeys(
    "ctrl+shift+c",
    (event) => {
      event.preventDefault();
      setIsDialogOpen(true);
    },
    { enableOnFormTags: false }
  );

  if (data.status !== "PENDING" || isPending) {
    return null;
  }

  return (
    <Tooltip>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="secondary" className="w-full">
              Cancel Request
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Request Cancellation</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Canceling this request will
              permanently stop any ongoing processes, and it will no longer be
              tracked or acted upon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleCancellation}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipContent className="flex items-center gap-3" side="bottom">
        <P>Cancel request</P>
        <div className="space-x-1">
          <CommandShortcut>Ctrl</CommandShortcut>
          <CommandShortcut>Shift</CommandShortcut>
          <CommandShortcut>C</CommandShortcut>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
