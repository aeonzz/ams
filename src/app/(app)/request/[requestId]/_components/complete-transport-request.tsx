"use client";

import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import React from "react";
import type { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation"; 
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { toast } from "sonner";
import { socket } from "@/app/socket";
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
import { completeTransportRequest } from "@/lib/actions/requests";

interface CompleteTransportRequestProps {
  requestId: string;
}

export default function CompleteTransportRequest({
  requestId,
}: CompleteTransportRequestProps) {
  const pathname = usePathname();
  const { mutateAsync, isPending } = useServerActionMutation(
    completeTransportRequest
  );

  async function handleUpdate(status: RequestStatusTypeType) {
    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: requestId,
      status: status,
    };

    toast.promise(mutateAsync(data), {
      loading: "Marking transport request as completed...",
      success: () => {
        socket.emit("request_update");
        socket.emit("notifications");
        return "The transport request has been marked as completed successfully.";
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
          <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this transport request as completed?
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
