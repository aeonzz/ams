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
import { usePathname } from "next/navigation";
import { P } from "@/components/typography/text";
import { PermissionGuard } from "@/components/permission-guard";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

interface VenueRequestActionsProps {
  requestId: string;
  departmentId: string;
}

export default function VenueRequestActions({
  requestId,
  departmentId,
}: VenueRequestActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const { mutateAsync, isPending } =
    useServerActionMutation(udpateVenueRequest);

  async function handleUpdate() {
    toast.promise(
      mutateAsync({
        id: requestId,
        path: pathname,
        inProgress: true,
        actualStart: new Date(),
        venueStatus: "IN_USE",
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [requestId] });
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
    <PermissionGuard
      allowedRoles={["OPERATIONS_MANAGER"]}
      allowedDepartment={departmentId}
      currentUser={currentUser}
    >
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending} onClick={() => setIsAlertOpen(true)}>
            Start Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
        >
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
    </PermissionGuard>
  );
}
