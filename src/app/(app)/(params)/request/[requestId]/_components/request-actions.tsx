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
import { updateRequest } from "@/lib/actions/requests";
import { type ExtendedUpdateJobRequestSchema } from "@/lib/schema/request";
import { type RequestWithRelations } from "prisma/generated/zod";

interface RequestActionsProps {
  data: RequestWithRelations;
  params: string;
}

export default function RequestActions({ data, params }: RequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useServerActionMutation(updateRequest);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  function handleCancellation() {
    const values: ExtendedUpdateJobRequestSchema = {
      id: data.id,
      path: pathname,
      status: "CANCELLED",
    };

    // Optimistic update
    queryClient.setQueryData([params], (oldData: RequestWithRelations) => ({
      ...oldData,
      status: "CANCELLED",
    }));

    toast.promise(mutateAsync(values), {
      loading: "Cancelling...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: [params],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-dashboard-overview"],
        });
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

  if (data.status !== "PENDING" || isPending) {
    return null;
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="w-full">
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
  );
}
