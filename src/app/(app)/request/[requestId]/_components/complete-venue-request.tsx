"use client";

import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import React from "react";
import type { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
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
import { Button } from "@/components/ui/button";
import { completeVenueRequest } from "@/lib/actions/requests";
import { useQueryClient } from "@tanstack/react-query";

interface CompleteVenueRequestProps {
  requestId: string;
}

export default function CompleteVenueRequest({
  requestId,
}: CompleteVenueRequestProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } =
    useServerActionMutation(completeVenueRequest);

  async function handleUpdate(status: RequestStatusTypeType) {
    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: requestId,
      status: status,
    };

    toast.promise(mutateAsync(data), {
      loading: "Marking reservation as completed...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: [requestId] });
        return "The reservation has been marked as completed successfully.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending}>Mark as Completed</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Mark as Completed</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this venue reservation as completed?
            This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleUpdate("COMPLETED")}
            disabled={isPending}
          >
            Mark as Completed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
