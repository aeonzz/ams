"use client";

import React from "react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateTransportRequest } from "@/lib/actions/requests";
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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { TransportRequestWithRelations } from "prisma/generated/zod";
import { usePathname } from "next/navigation";
import { P } from "@/components/typography/text";

interface TransportRequestActionsProps {
  data: TransportRequestWithRelations;
}

export default function TransportRequestActions({
  data,
}: TransportRequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useServerActionMutation(
    updateTransportRequest
  );

  async function handleUpdate() {
    toast.promise(
      mutateAsync({
        id: data.requestId,
        path: pathname,
        inProgress: true,
        odometerStart: data.vehicle.odometer,
        actualStart: new Date(),
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [data.requestId] });
          return "The transport request has been started successfully.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  }

  return (
    <>
      <div>
        <P className="text-xs text-muted-foreground">Current odometer value:</P>
        <div className="flex w-full items-center p-2">
          <P className="font-medium">{data.vehicle.odometer}</P>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending}>Start Request</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Start Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start this transport request? This action
              will update the status to "In Progress" and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdate()}
              disabled={isPending}
            >
              Start Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
