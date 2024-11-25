"use client";

import React from "react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  udpateVenueRequest,
  updateTransportRequest,
} from "@/lib/actions/requests";
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
import type { VenueRequestWithRelations } from "prisma/generated/zod";
import { usePathname } from "next/navigation";
import { P } from "@/components/typography/text";

interface VenueRequestActionsProps {
  data: VenueRequestWithRelations;
}

export default function VenueRequestActions({
  data,
}: VenueRequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const { mutateAsync, isPending } =
    useServerActionMutation(udpateVenueRequest);

  async function handleUpdate() {
    toast.promise(
      mutateAsync({
        id: data.requestId,
        path: pathname,
        inProgress: true,
        actualStart: new Date(),
        venueStatus: "IN_USE",
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [data.requestId] });
          return "The venue request has been started successfully.";
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending} onClick={() => setIsAlertOpen(true)}>
            Start Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Start Venue Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start this venue request? This action
              will update the status to &quot;In Use&quot; and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsAlertOpen(true)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
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
