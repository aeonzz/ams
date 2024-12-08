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
import { Label } from "@/components/ui/label";
import { cancelRequest } from "@/lib/actions/job";
import type { CancelRequestSchema } from "./schema";
import { Textarea } from "@/components/ui/text-area";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";

interface CancelRequestProps {
  requestStatus: RequestStatusTypeType;
  requestId: string;
  disabled?: boolean;
}

export default function CancelRequest({
  requestStatus,
  requestId,
  disabled = false,
}: CancelRequestProps) {
  const pathname = usePathname();
  const currentUser = useSession();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const { mutateAsync, isPending } = useServerActionMutation(cancelRequest);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [cancellationReason, setCancellationReason] = React.useState("");

  async function handleCancellation() {
    if (!cancellationReason.trim()) {
      toast.error(
        "Cancellation reason is required for approved or reviewed requests."
      );
      return;
    }

    const values: CancelRequestSchema = {
      requestId: requestId,
      path: pathname,
      status: "CANCELLED",
      userId: currentUser.id,
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
    disabled
  ) {
    return null;
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => setIsDialogOpen(true)}
        >
          Cancel Request
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Request Cancellation</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Canceling this request will
            permanently stop any ongoing processes, and it will no longer be
            tracked or acted upon.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mb-4">
          <Label htmlFor="cancellationReason" className="mb-2 block">
            Cancellation Reason <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="cancellationReason"
            maxRows={6}
            minRows={3}
            autoFocus
            placeholder="Enter reason for cancellation"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            required
            className="text-sm placeholder:text-sm"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !cancellationReason.trim()}
            className="bg-destructive hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              handleCancellation();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
