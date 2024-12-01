"use client";

import React from "react";
import type { VenueRequestWithRelations } from "prisma/generated/zod";
import { useSession } from "@/lib/hooks/use-session";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { udpateVenueRequest } from "@/lib/actions/requests";
import type { UpdateVenueRequestSchemaWithPath } from "@/lib/schema/request";
import { usePathname } from "next/navigation";
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
import { useQueryClient } from "@tanstack/react-query";

interface VenueChairApprovalProps {
  data: VenueRequestWithRelations;
  requestId: string;
}

export default function VenueChairApproval({
  data,
  requestId,
}: VenueChairApprovalProps) {
  const currentUser = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = React.useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] =
    React.useState(false);

  const departmentHead = React.useMemo(() => {
    const departmentRoles = data.department?.userRole || [];
    return departmentRoles.find(
      (userRole) => userRole.role?.name === "DEPARTMENT_HEAD"
    );
  }, [data.department?.userRole]);

  const { mutateAsync, isPending } =
    useServerActionMutation(udpateVenueRequest);

  async function handleUpdate(value: boolean) {
    try {
      const data: UpdateVenueRequestSchemaWithPath = {
        path: pathname,
        id: requestId,
        approvedByHead: value,
      };
      toast.promise(mutateAsync(data), {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [requestId] });
          return value
            ? "Request approved successfully"
            : "Request disapproved successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  }

  if (!departmentHead || departmentHead.userId !== currentUser.id) return null;

  return (
    <div className="flex flex-col gap-3">
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            disabled={isPending}
            onClick={() => setIsApproveDialogOpen(true)}
          >
            Approve Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this venue reservation request?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleUpdate(true);
                setIsApproveDialogOpen(false);
              }}
            >
              Approve Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDisapproveDialogOpen}
        onOpenChange={setIsDisapproveDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => setIsDisapproveDialogOpen(true)}
          >
            Disapprove Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Disapproval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disapprove this venue reservation
              request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsDisapproveDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleUpdate(false);
                setIsDisapproveDialogOpen(false);
              }}
            >
              Disapprove Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
