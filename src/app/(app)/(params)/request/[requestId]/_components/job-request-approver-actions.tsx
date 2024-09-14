"use client";

import React from "react";
import { format } from "date-fns";
import {
  type JobRequestWithRelations,
  type RequestWithRelations,
} from "prisma/generated/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  UserPlus,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { H4, H5, P } from "@/components/typography/text";
import { type RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { type UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { updateRequestStatus } from "@/lib/actions/job";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { useQueryClient } from "@tanstack/react-query";

interface JobRequestApproverActionsProps {
  jobRequest: JobRequestWithRelations;
}

export default function JobRequestApproverActions({
  jobRequest,
}: JobRequestApproverActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateRequestStatus);

  const handleReview = (action: RequestStatusTypeType) => {
    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: jobRequest.requestId,
      status: action,
    };

    const actionText = action === "APPROVED" ? "Approving" : "Rejecting";
    const successText = action === "APPROVED" ? "approved" : "rejected";

    toast.promise(updateStatusMutate(data), {
      loading: `${actionText} job request...`,

      success: () => {
        queryClient.invalidateQueries({
          queryKey: [jobRequest.requestId],
        });
        setIsOpen(false);
        return `Job request ${successText} successfully.`;
      },
      error: (err) => {
        console.error(err);
        return `Failed to ${action.toLowerCase()} job request. Please try again.`;
      },
    });
  };

  const UserInfo = ({ user, role }: { user: any; role: string }) => (
    <div className="flex items-start">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.profileUrl} />
          <AvatarFallback>
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Badge variant="outline" className="ml-auto">
        {role}
      </Badge>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <FolderKanban className="mr-2 h-4 w-4" />
          Administer Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Job Request</DialogTitle>
          <DialogDescription>
            Review and take action on this job request.
          </DialogDescription>
        </DialogHeader>
        <div className="scroll-bar flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <P className="font-semibold">Assigned Personnel</P>
              {jobRequest.assignedUser ? (
                <UserInfo
                  user={jobRequest.assignedUser}
                  role="Assigned Personnel"
                />
              ) : (
                <p className="text-muted-foreground">No user assigned</p>
              )}
            </div>
            <div className="space-y-2">
              <P className="font-semibold">Reviewer</P>
              {jobRequest.reviewer ? (
                <UserInfo user={jobRequest.reviewer} role="Reviewer" />
              ) : (
                <p className="text-muted-foreground">No reviewer assigned</p>
              )}
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <DialogFooter className="flex justify-between">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <div className="space-x-3">
            <Button
              variant="destructive"
              disabled={isUpdateStatusPending}
              onClick={() => handleReview("REJECTED")}
            >
              Reject
            </Button>
            <Button
              disabled={isUpdateStatusPending}
              onClick={() => handleReview("APPROVED")}
            >
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
