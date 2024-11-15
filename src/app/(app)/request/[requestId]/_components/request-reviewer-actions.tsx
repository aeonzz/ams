"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderKanban } from "lucide-react";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateRequestStatus } from "@/lib/actions/job";
import { UpdateRequestStatusSchemaWithPath } from "./schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { formatFullName } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import RequestApproverActions from "./request-approver-actions";
import { PermissionGuard } from "@/components/permission-guard";
import type { EntityTypeType } from "prisma/generated/zod/inputTypeSchemas/EntityTypeSchema";
import { useHotkeys } from "react-hotkeys-hook";
import { Textarea } from "@/components/ui/text-area";
import { CommandShortcut } from "@/components/ui/command";

interface RequestReviewerActionsProps {
  request: RequestWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
  allowedApproverRoles: string[];
}

export default function RequestReviewerActions({
  request,
  allowedRoles,
  allowedDepartment,
  allowedApproverRoles,
  
}: RequestReviewerActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isRejectionAlertOpen, setIsRejectionAlertOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateRequestStatus);

  useHotkeys(
    "m",
    (event) => {
      event.preventDefault();
      setIsOpen(true);
    },
    { enableOnFormTags: false }
  );

  const handleReview = React.useCallback(
    (action: "REVIEWED" | "REJECTED" | "COMPLETED" | "CANCELLED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        reviewerId: currentUser.userRole.some(
          (role) => role.role.name === "OPERATIONS_MANAGER"
        )
          ? currentUser.id
          : undefined,
        status: action,
        rejectionReason: action === "REJECTED" ? rejectionReason : undefined,
      };

      if (action === "REJECTED" && !rejectionReason.trim()) {
        return toast.error("Please provide a cancellation reason");
      }

      const actionText =
        action === "REVIEWED"
          ? "Approving"
          : action === "REJECTED"
            ? "Rejecting"
            : action === "COMPLETED"
              ? "Completing"
              : "Cancelling";
      const successText =
        action === "REVIEWED"
          ? "approved"
          : action === "REJECTED"
            ? "rejected"
            : action === "COMPLETED"
              ? "completed"
              : "cancelled";

      toast.promise(updateStatusMutate(data), {
        loading: `${actionText} request...`,
        success: () => {
          setIsRejectionAlertOpen(false);
          setRejectionReason("");
          return `Request ${successText} successfully.`;
        },
        error: (err) => {
          console.error(err);
          return `Failed to ${action.toLowerCase()} request. Please try again.`;
        },
      });
    },
    [
      pathname,
      request.id,
      updateStatusMutate,
      currentUser.id,
      currentUser.userRole,
      rejectionReason,
    ]
  );

  if (request.status === "COMPLETED" || request.status === "CANCELLED") {
    return null;
  }

  return (
    <PermissionGuard
      allowedRoles={allowedRoles}
      allowedDepartment={allowedDepartment}
      currentUser={currentUser}
    >
      <TooltipProvider>
        <Tooltip>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button className="w-full" variant="secondary">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Manage Request
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                if (isUpdateStatusPending) {
                  e.preventDefault();
                }
              }}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="sm:max-w-[425px]"
            >
              <DialogHeader>
                <DialogTitle>Manage Request</DialogTitle>
                <DialogDescription>
                  Review and take action on this request.
                </DialogDescription>
              </DialogHeader>
              <div className="scroll-bar flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-1">
                {request.status === "PENDING" && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleReview("REVIEWED")}
                      disabled={isUpdateStatusPending}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {request.reviewer && (
                    <div>
                      <P className="text-xs text-muted-foreground">
                        Reviewed By:
                      </P>
                      <div className="flex w-full items-center p-2">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage
                            src={request.reviewer.profileUrl ?? ""}
                            alt={formatFullName(
                              request.reviewer.firstName,
                              request.reviewer.middleName,
                              request.reviewer.lastName
                            )}
                          />
                          <AvatarFallback>
                            {request.reviewer.firstName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <P className="font-medium">
                            {formatFullName(
                              request.reviewer.firstName,
                              request.reviewer.middleName,
                              request.reviewer.lastName
                            )}
                          </P>
                        </div>
                      </div>
                    </div>
                  )}
                  {request.jobRequest?.status === "COMPLETED" && (
                    <>
                      <AlertDialog
                        open={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            className="w-full"
                            disabled={isUpdateStatusPending}
                          >
                            Complete Request
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Complete Request
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to mark this request as
                              completed? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleReview("COMPLETED")}
                            >
                              Complete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  {request.status === "REVIEWED" && (
                    <PermissionGuard
                      allowedRoles={allowedApproverRoles}
                      allowedDepartment={allowedDepartment}
                      currentUser={currentUser}
                    >
                      <RequestApproverActions
                        request={request}
                        isPending={isUpdateStatusPending}
                      />
                    </PermissionGuard>
                  )}
                  {request.status === "PENDING" && (
                    <AlertDialog
                      open={isRejectionAlertOpen}
                      onOpenChange={setIsRejectionAlertOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full"
                          variant="destructive"
                          disabled={isUpdateStatusPending}
                        >
                          Reject Request
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="">
                            Reject Request
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this request? This
                            action cannot be undone. Please provide a reason for
                            rejection.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea
                          maxRows={6}
                          minRows={3}
                          placeholder="Rejection reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="text-sm placeholder:text-sm"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleReview("REJECTED")}
                            disabled={!rejectionReason.trim()}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              <Separator className="my-2" />
              <DialogFooter>
                <Button
                  variant="secondary"
                  disabled={isUpdateStatusPending}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <TooltipContent className="flex items-center gap-3" side="bottom">
            <P>Manage request</P>
            <CommandShortcut>M</CommandShortcut>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PermissionGuard>
  );
}
