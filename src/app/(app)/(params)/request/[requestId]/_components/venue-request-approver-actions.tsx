"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { RequestWithRelations } from "prisma/generated/zod";
import { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
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
import { updateVenueRequestStatus } from "@/lib/actions/venue";
import { useSession } from "@/lib/hooks/use-session";

interface VenueRequestApproverActionsProps {
  request: RequestWithRelations;
}

export default function VenueRequestApproverActions({
  request,
}: VenueRequestApproverActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [action, setAction] = React.useState<RequestStatusTypeType | null>(
    null
  );
  const { mutateAsync, isPending } = useServerActionMutation(
    updateVenueRequestStatus
  );

  const handleActionClick = (selectedAction: RequestStatusTypeType) => {
    setAction(selectedAction);
    setIsDialogOpen(true);
  };

  const handleReview = async () => {
    if (!action) return;

    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: request.id,
      entityType: "VENUE_REQUEST",
      reviewerId: currentUser.id,
      changeType: "REVIEWER_CHANGE",
      status: action,
    };

    const actionText = action === "APPROVED" ? "Approving" : "Rejecting";
    const successText = action === "APPROVED" ? "approved" : "rejected";

    toast.promise(mutateAsync(data), {
      loading: `${actionText} request...`,
      success: () => {
        queryClient.invalidateQueries({ queryKey: [request.id] });
        queryClient.invalidateQueries({
          queryKey: [request.venueRequest?.id],
        });
        setIsDialogOpen(false);
        return `Request ${successText} successfully.`;
      },
      error: (err) => {
        console.error(err);
        return err.message;
      },
    });
  };

  const getDialogContent = () => {
    if (!action) return null;

    return {
      title: action === "APPROVED" ? "Approve Request" : "Reject Request",
      description: `Are you sure you want to ${action.toLowerCase().slice(0, action.length - 1)} this request?`,
    };
  };

  const dialogContent = getDialogContent();

  if (request.status !== "PENDING" && request.status !== "REVIEWED") {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          className="flex-1"
          onClick={() => handleActionClick("APPROVED")}
          disabled={isPending}
        >
          Approve
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => handleActionClick("REJECTED")}
          disabled={isPending}
        >
          Reject
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReview}>
              {action === "APPROVED" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
