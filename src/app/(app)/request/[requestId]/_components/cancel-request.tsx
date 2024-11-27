"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { cancelRequest } from "@/lib/actions/job";
import type { CancelRequestSchema } from "./schema";
import { Textarea } from "@/components/ui/text-area";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

interface CancelRequestProps {
  requestStatus: RequestStatusTypeType;
  requestId: string;
  inProgress?: boolean;
}

export default function CancelRequest({
  requestStatus,
  requestId,
  inProgress = false,
}: CancelRequestProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useServerActionMutation(cancelRequest);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  async function handleCancellation() {
    if (
      (requestStatus === "APPROVED" || requestStatus === "REVIEWED") &&
      !cancellationReason.trim()
    ) {
      toast.error(
        "Cancellation reason is required for approved or reviewed requests."
      );
      return;
    }

    const values: CancelRequestSchema = {
      requestId: requestId,
      path: pathname,
      status: "CANCELLED",
      cancellationReason: cancellationReason.trim(),
    };

    toast.promise(mutateAsync(values), {
      loading: "Cancelling...",
      success: () => {
        setIsDialogOpen(false);
        setCancellationReason("");
        queryClient.invalidateQueries({ queryKey: [requestId] });
        return "Request cancelled successfully";
      },
      error: (err) => {
        console.error(err);
        return "Something went wrong, please try again later.";
      },
    });
  }

  if (
    !["PENDING", "APPROVED", "REVIEWED", "ON_HOLD"].includes(requestStatus) ||
    inProgress
  ) {
    return null;
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Cancel Request
        </Button>
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
        {(requestStatus === "APPROVED" ||
          requestStatus === "REVIEWED" ||
          requestStatus === "ON_HOLD") && (
          <div className="mb-4">
            <Label htmlFor="cancellationReason" className="mb-2 block">
              Cancellation Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cancellationReason"
              maxRows={6}
              minRows={3}
              placeholder="Enter reason for cancellation"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              required
              className="text-sm placeholder:text-sm"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              (requestStatus === "APPROVED" ||
                requestStatus === "REVIEWED" ||
                requestStatus === "ON_HOLD") &&
              !cancellationReason.trim()
            }
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleCancellation}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
