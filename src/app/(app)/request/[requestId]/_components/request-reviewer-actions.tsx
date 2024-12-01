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
import { Label } from "@/components/ui/label";
import { ClientRoleGuard } from "@/components/client-role-guard";
import { AlertCard } from "@/components/ui/alert-card";
import CancelRequest from "./cancel-request";

interface RequestReviewerActionsProps {
  request: RequestWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
  allowedApproverRoles: string[];
  actionNeeded?: boolean;
  children?: React.ReactNode;
  inProgress?: boolean;
}

export default function RequestReviewerActions({
  request,
  allowedRoles,
  allowedDepartment,
  allowedApproverRoles,
  actionNeeded = false,
  children,
  inProgress,
}: RequestReviewerActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRejectionAlertOpen, setIsRejectionAlertOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [isOnHoldAlertOpen, setIsOnHoldAlertOpen] = React.useState(false);
  const [isApproveAlertOpen, setIsApproveAlertOpen] = React.useState(false);
  const [onHoldReason, setOnHoldReason] = React.useState("");

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
    (
      action:
        | "REVIEWED"
        | "REJECTED"
        | "COMPLETED"
        | "CANCELLED"
        | "ON_HOLD"
        | "APPROVED"
    ) => {
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
        onHoldReason: action === "ON_HOLD" ? onHoldReason : undefined,
      };

      if (action === "REJECTED" && !rejectionReason.trim()) {
        return toast.error("Please provide a cancellation reason");
      }

      if (action === "ON_HOLD" && !onHoldReason.trim()) {
        return toast.error(
          "Please provide a reason for putting the request on hold"
        );
      }

      const actionText =
        action === "APPROVED"
          ? "Approving"
          : action === "REVIEWED"
            ? "Reviewing"
            : action === "REJECTED"
              ? "Rejecting"
              : action === "COMPLETED"
                ? "Completing"
                : action === "ON_HOLD"
                  ? "Putting on hold"
                  : "Cancelling";
      const successText =
        action === "APPROVED"
          ? "approved"
          : action === "REVIEWED"
            ? "reviewed"
            : action === "REJECTED"
              ? "rejected"
              : action === "COMPLETED"
                ? "completed"
                : action === "ON_HOLD"
                  ? "put on hold"
                  : "cancelled";

      toast.promise(updateStatusMutate(data), {
        loading: `${actionText} request...`,
        success: () => {
          setIsRejectionAlertOpen(false);
          setIsOnHoldAlertOpen(false);
          setIsApproveAlertOpen(false);
          setIsOpen(false);
          setRejectionReason("");
          setOnHoldReason("");
          queryClient.invalidateQueries({ queryKey: [request.id] });
          return `Request ${successText} successfully.`;
        },
        error: (err) => {
          console.error(err);
          return `Something went Wrong!. Please try again.`;
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
      onHoldReason,
    ]
  );

  if (
    request.status === "COMPLETED" ||
    request.status === "CANCELLED" ||
    request.status === "REJECTED" ||
    inProgress
  ) {
    return null;
  }

  return (
    <PermissionGuard
      allowedRoles={allowedRoles}
      allowedDepartment={allowedDepartment}
      currentUser={currentUser}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="relative w-full" variant="secondary">
            {actionNeeded && (
              <div className="absolute left-[28%] top-2.5 size-2.5 rounded-full border-2 border-tertiary bg-red-500" />
            )}
            <FolderKanban className="mr-2 h-4 w-4" />
            Manage Request
          </Button>
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
              <ClientRoleGuard allowedRoles={["DEPARTMENT_HEAD"]}>
                <AlertCard
                  variant="info"
                  title="Waiting for Reviewer"
                  description="This job request is currently waiting for the reviewer to approve."
                  className="mb-6"
                />
              </ClientRoleGuard>
            )}
            {request.status === "REVIEWED" && (
              <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                <AlertCard
                  variant="info"
                  title="Waiting for Approval"
                  description="This job request is currently waiting for the request head to approve."
                  className="mb-6"
                />
              </ClientRoleGuard>
            )}
            {request.reviewer && (
              <div>
                <P className="text-xs text-muted-foreground">Reviewed By:</P>
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
            {request.status === "PENDING" && (
              <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                <Button
                  onClick={() => handleReview("REVIEWED")}
                  disabled={isUpdateStatusPending}
                  className="flex-1"
                >
                  Approve
                </Button>
                <AlertDialog
                  open={isRejectionAlertOpen}
                  onOpenChange={setIsRejectionAlertOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="destructive"
                      disabled={isUpdateStatusPending}
                      onClick={() => setIsRejectionAlertOpen(true)}
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
                      <AlertDialogCancel
                        disabled={isUpdateStatusPending}
                        onClick={() => setIsRejectionAlertOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReview("REJECTED");
                        }}
                        disabled={
                          !rejectionReason.trim() || isUpdateStatusPending
                        }
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ClientRoleGuard>
            )}
            {request.status === "ON_HOLD" && (
              <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                <AlertDialog
                  open={isApproveAlertOpen}
                  onOpenChange={setIsApproveAlertOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="default"
                      disabled={isUpdateStatusPending}
                      onClick={() => setIsRejectionAlertOpen(true)}
                    >
                      Resume
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Resume Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        This request is currently on hold. Resuming it will mark
                        it as active and ready for further action. Are you sure
                        you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isUpdateStatusPending}
                        onClick={() => setIsApproveAlertOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isUpdateStatusPending}
                        onClick={(e) => {
                          e.preventDefault();
                          handleReview("APPROVED");
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ClientRoleGuard>
            )}
            {request.status === "REVIEWED" && (
              <ClientRoleGuard allowedRoles={["DEPARTMENT_HEAD"]}>
                <RequestApproverActions
                  request={request}
                  isPending={isUpdateStatusPending}
                />
              </ClientRoleGuard>
            )}
            {children}
            {request.status === "APPROVED" && !inProgress && (
              <ClientRoleGuard allowedRoles={["OPERATIONS_MANAGER"]}>
                <AlertDialog
                  open={isOnHoldAlertOpen}
                  onOpenChange={setIsOnHoldAlertOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="secondary"
                      disabled={isUpdateStatusPending}
                      onClick={() => setIsOnHoldAlertOpen(true)}
                    >
                      Put On Hold
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Put Request On Hold</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to put this request on hold?
                        Please provide a reason.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mb-4">
                      <Label htmlFor="onHoldReason" className="mb-2 block">
                        Hold Reason <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="onHoldReason"
                        maxRows={6}
                        minRows={3}
                        placeholder="Reason for putting on hold..."
                        value={onHoldReason}
                        onChange={(e) => setOnHoldReason(e.target.value)}
                        required
                        className="text-sm placeholder:text-sm"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isUpdateStatusPending}
                        onClick={() => setIsOnHoldAlertOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={!onHoldReason.trim() || isUpdateStatusPending}
                        onClick={(e) => {
                          e.preventDefault();
                          handleReview("ON_HOLD");
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ClientRoleGuard>
            )}
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
    </PermissionGuard>
  );
}
