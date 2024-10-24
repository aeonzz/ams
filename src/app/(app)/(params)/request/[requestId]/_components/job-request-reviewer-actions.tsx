"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { FolderKanban, Check, AlertCircle, Loader2 } from "lucide-react";
import type {
  RequestWithRelations,
  UserDepartment,
  UserDepartmentWithRelations,
  UserWithRelations,
} from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  updateRequestStatus,
  assignPersonnel,
  updateJobRequest,
} from "@/lib/actions/job";
import {
  UpdateRequestStatusSchemaWithPath,
  AssignPersonnelSchemaWithPath,
} from "./schema";
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
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { formatFullName } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import RequestApproverActions from "./request-approver-actions";
import { PermissionGuard } from "@/components/permission-guard";
import type { EntityTypeType } from "prisma/generated/zod/inputTypeSchemas/EntityTypeSchema";
import IsError from "@/components/is-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotkeys } from "react-hotkeys-hook";
import AddEstimatedTime from "./add-estimated-time";
import { Textarea } from "@/components/ui/text-area";
import { socket } from "@/app/socket";
import RejectJob from "./reject-job";

interface JobRequestReviewerActionsProps {
  request: RequestWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
  allowedApproverRoles: string[];
}

export default function JobRequestReviewerActions({
  request,
  allowedRoles,
  allowedDepartment,
  allowedApproverRoles,
}: JobRequestReviewerActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<
    string | undefined | null
  >(request.jobRequest?.assignedTo);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isRejectionAlertOpen, setIsRejectionAlertOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const {
    data: personnel,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserDepartmentWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get(
        `/api/user/personnel/get-personnels/${request.departmentId}`
      );
      return res.data.data;
    },
    queryKey: ["get-personnels"],
  });

  const { mutateAsync: updateStatusMutate, isPending: isUpdateStatusPending } =
    useServerActionMutation(updateRequestStatus);

  const {
    mutateAsync: assignPersonnelMutate,
    isPending: isAssignPersonnelPending,
  } = useServerActionMutation(assignPersonnel);

  const { isPending: isPendingMutation, mutateAsync } =
    useServerActionMutation(updateJobRequest);

  useHotkeys(
    "m",
    (event) => {
      event.preventDefault();
      setIsOpen(true);
    },
    { enableOnFormTags: false }
  );

  React.useEffect(() => {
    setSelectedPerson(request.jobRequest?.assignedTo);
  }, [request.jobRequest?.assignedTo]);

  const handleReview = React.useCallback(
    async (action: "REVIEWED" | "REJECTED" | "COMPLETED" | "CANCELLED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        reviewerId: currentUser.userRole.some(
          (role) => role.role.name === "REQUEST_MANAGER"
        )
          ? currentUser.id
          : undefined,
        status: action,
        rejectionReason: action === "REJECTED" ? rejectionReason : undefined,
      };

      if (!request.jobRequest?.estimatedTime && action !== "REJECTED") {
        return toast.error("Please add job estimated time");
      }

      if (action === "REJECTED" && !rejectionReason.trim()) {
        return toast.error("Please provide a rejection reason");
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

      try {
        toast.promise(updateStatusMutate(data), {
          loading: `${actionText} request...`,
          success: () => {
            socket.emit("notifications");
            socket.emit("request_update");
            setIsRejectionAlertOpen(false);
            setRejectionReason("");
            return `Request ${successText} successfully.`;
          },
          error: `Failed to ${action.toLowerCase()} request. Please try again.`,
        });

        if (action === "COMPLETED") {
          await mutateAsync({
            path: pathname,
            status: "VERIFIED",
            requestId: request.id,
          });
        }

        socket.emit("notifications");
        socket.emit("request_update");
        setIsRejectionAlertOpen(false);
        setRejectionReason("");
      } catch (err) {
        console.error(err);
      }
    },
    [
      pathname,
      request.id,
      updateStatusMutate,
      mutateAsync,
      currentUser.id,
      currentUser.userRole,
      request.jobRequest?.estimatedTime,
      rejectionReason,
    ]
  );

  const handleAssignPersonnel = React.useCallback(
    async (id: string) => {
      if (id === selectedPerson) {
        return;
      }

      setSelectedPerson(id);

      const data: AssignPersonnelSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        personnelId: id,
      };

      toast.promise(assignPersonnelMutate(data), {
        loading: "Assigning...",
        success: () => {
          socket.emit("request_update", request.id);
          return "Personnel assigned successfully.";
        },
        error: (err) => {
          setSelectedPerson(null);
          console.error(err);
          return err.message;
        },
      });
    },
    [
      selectedPerson,
      pathname,
      request.jobRequest?.id,
      request.id,
      assignPersonnelMutate,
    ]
  );

  if (
    request.status === "COMPLETED" ||
    request.status === "CANCELLED" ||
    request.status === "REJECTED"
  ) {
    return null;
  }

  const renderPersonnelList = () => {
    if (isLoading) {
      return (
        <Command className="max-h-[250px]">
          <CommandInput placeholder="Search personnel..." disabled />
          <CommandList>
            <CommandGroup>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center px-2 py-1.5">
                  <Skeleton className="mr-2 h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
    }

    if (isError) {
      return <IsError error={error} refetch={refetch} />;
    }

    return (
      <Command className="h-fit max-h-[250px]">
        <CommandInput placeholder="Search personnel..." />
        <CommandList>
          <CommandEmpty>No personnel found.</CommandEmpty>
          <CommandGroup>
            {personnel?.map((item) => (
              <CommandItem
                key={item.user.id}
                onSelect={() => handleAssignPersonnel(item.userId)}
                disabled={isAssignPersonnelPending}
              >
                <div className="flex w-full items-center">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage
                      src={item.user.profileUrl ?? ""}
                      alt={formatFullName(
                        item.user.firstName,
                        item.user.middleName,
                        item.user.lastName
                      )}
                    />
                    <AvatarFallback>
                      {item.user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <P className="font-medium">
                      {formatFullName(
                        item.user.firstName,
                        item.user.middleName,
                        item.user.lastName
                      )}
                    </P>
                  </div>
                  {item.user.id === selectedPerson && (
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <PermissionGuard
      allowedRoles={allowedRoles}
      allowedDepartment={allowedDepartment}
      currentUser={currentUser}
    >
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
              if (isUpdateStatusPending || isAssignPersonnelPending) {
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
            <div className="scroll-bar max-h-[55vh] gap-3 space-y-1 overflow-y-auto px-4 py-1">
              {request.status !== "APPROVED" && <>{renderPersonnelList()}</>}
              <AddEstimatedTime data={request} />
              {request.jobRequest?.assignedUser && (
                <div>
                  <P className="text-xs text-muted-foreground">
                    Assigned Personnel:
                  </P>
                  <div className="flex w-full items-center p-2">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={request.jobRequest.assignedUser.profileUrl ?? ""}
                        alt={formatFullName(
                          request.jobRequest.assignedUser.firstName,
                          request.jobRequest.assignedUser.middleName,
                          request.jobRequest.assignedUser.lastName
                        )}
                      />
                      <AvatarFallback>
                        {request.jobRequest.assignedUser.firstName
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <P className="font-medium">
                        {formatFullName(
                          request.jobRequest.assignedUser.firstName,
                          request.jobRequest.assignedUser.middleName,
                          request.jobRequest.assignedUser.lastName
                        )}
                      </P>
                    </div>
                  </div>
                </div>
              )}
              {request.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleReview("REVIEWED")}
                    disabled={
                      !selectedPerson ||
                      isUpdateStatusPending ||
                      isAssignPersonnelPending
                    }
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
                          disabled={
                            isUpdateStatusPending ||
                            isAssignPersonnelPending ||
                            isPendingMutation
                          }
                        >
                          Verify and Complete Request
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Complete Request</AlertDialogTitle>
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
                    <RejectJob
                      requestId={request.id}
                      disabled={isUpdateStatusPending || isPendingMutation}
                    />
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
                      isPending={
                        isUpdateStatusPending || isAssignPersonnelPending
                      }
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
                        disabled={
                          isUpdateStatusPending || isAssignPersonnelPending
                        }
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
                disabled={isAssignPersonnelPending || isUpdateStatusPending}
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
    </PermissionGuard>
  );
}
