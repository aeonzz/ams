"use client";

import React from "react";

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
import { updateRequest } from "@/lib/actions/requests";
import { usePathname } from "next/navigation";
import { type ExtendedUpdateJobRequestSchema } from "@/lib/schema/request";
import { toast } from "sonner";
import { type RequestWithRelations } from "prisma/generated/zod";

interface RequestActionsProps {
  data: RequestWithRelations;
  refetch: () => void;
}

export default function RequestActions({ data, refetch }: RequestActionsProps) {
  const pathname = usePathname();
  const { mutateAsync, isPending } = useServerActionMutation(updateRequest);

  function handleCancellation() {
    const values: ExtendedUpdateJobRequestSchema = {
      id: data.id,
      path: pathname,
      status: "CANCELLED",
    };

    toast.promise(mutateAsync(values), {
      loading: "Cancelling...",
      success: () => {
        refetch();
        return "Request cancelled succesfuly";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong, please try again later.";
      },
    });
  }

  return (
    <>
      {data.status !== "CANCELLED" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" disabled={isPending}>
              Cancel Request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
      )}
    </>
  );
}
