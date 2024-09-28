"use client";

import React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
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
} from "@/components/ui/command";
import { FolderKanban, Check, AlertCircle, Loader2 } from "lucide-react";
import type {
  RequestWithRelations,
  UserDepartment,
  UserDepartmentWithRelations,
  UserWithRelations,
} from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateJobRequestStatus, assignPersonnel } from "@/lib/actions/job";
import {
  UpdateRequestStatusSchemaWithPath,
  AssignPersonnelSchemaWithPath,
} from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { formatFullName } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import JobRequestApproverActions from "./job-request-approver-actions";
import { PermissionGuard } from "@/components/permission-guard";
import type { EntityTypeType } from "prisma/generated/zod/inputTypeSchemas/EntityTypeSchema";
import IsError from "@/components/is-error";
import { Skeleton } from "@/components/ui/skeleton";

interface JobRequestReviewerActionsProps {
  request: RequestWithRelations;
  showPersonnels?: boolean;
  entityType: EntityTypeType;
  allowedRoles: string[];
  allowedDepartment?: string;
  allowedApproverRoles: string[];
  requestTypeId: string;
}

export default function JobRequestReviewerActions({
  request,
  showPersonnels = false,
  entityType,
  allowedRoles,
  allowedDepartment,
  allowedApproverRoles,
  requestTypeId,
}: JobRequestReviewerActionsProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<
    string | undefined | null
  >(request.jobRequest?.assignedTo);

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
    useServerActionMutation(updateJobRequestStatus);

  const {
    mutateAsync: assignPersonnelMutate,
    isPending: isAssignPersonnelPending,
  } = useServerActionMutation(assignPersonnel);

  React.useEffect(() => {
    setSelectedPerson(request.jobRequest?.assignedTo);
  }, [request.jobRequest?.assignedTo]);

  const handleReview = React.useCallback(
    (action: "REVIEWED" | "REJECTED") => {
      const data: UpdateRequestStatusSchemaWithPath = {
        path: pathname,
        requestId: request.id,
        reviewerId: currentUser.userRole.some(
          (role) => role.role.name === "REQUEST_REVIEWER"
        )
          ? currentUser.id
          : undefined,
        status: action,
        changeType: "REVIEWER_CHANGE",
        entityType: entityType,
      };

      const actionText = action === "REVIEWED" ? "Approving" : "Rejecting";
      const successText = action === "REVIEWED" ? "approved" : "rejected";

      toast.promise(updateStatusMutate(data), {
        loading: `${actionText} request...`,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [request.id],
          });
          queryClient.invalidateQueries({
            queryKey: [request.jobRequest?.id],
          });
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
      queryClient,
      currentUser.id,
      currentUser.userRole,
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
        requestId: request.jobRequest?.id || "",
        personnelId: id,
      };

      toast.promise(assignPersonnelMutate(data), {
        loading: "Assigning...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [request.id],
          });
          queryClient.invalidateQueries({
            queryKey: [request.jobRequest?.id],
          });
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
      queryClient,
    ]
  );

  if (request.status !== "PENDING" && request.status !== "REVIEWED") {
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
      <Command className="max-h-[250px]">
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
      // allowedRoles={["REQUEST_REVIEWER"]}
      // allowedSection={request.jobRequest?.sectionId}
      allowedDepartment={allowedDepartment}
      currentUser={currentUser}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="secondary">
            <FolderKanban className="mr-2 h-4 w-4" />
            Manage Request
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            if (isUpdateStatusPending || isAssignPersonnelPending) {
              e.preventDefault();
            }
          }}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Manage Request</DialogTitle>
            <DialogDescription>
              Review and take action on this request.
            </DialogDescription>
          </DialogHeader>
          <div className="scroll-bar flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-1">
            {showPersonnels && <>{renderPersonnelList()}</>}
            {request.status === "PENDING" && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleReview("REVIEWED")}
                  disabled={
                    (!selectedPerson && showPersonnels) ||
                    isUpdateStatusPending ||
                    isAssignPersonnelPending
                  }
                  className="flex-1"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview("REJECTED")}
                  variant="destructive"
                  disabled={
                    (!selectedPerson && showPersonnels) ||
                    isUpdateStatusPending ||
                    isAssignPersonnelPending
                  }
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-3">
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
              {request.status === "REVIEWED" && (
                <PermissionGuard
                  allowedRoles={allowedApproverRoles}
                  allowedDepartment={allowedDepartment}
                  currentUser={currentUser}
                >
                  <JobRequestApproverActions
                    request={request}
                    isPending={
                      isUpdateStatusPending || isAssignPersonnelPending
                    }
                    entityType={entityType}
                    requestTypeId={requestTypeId}
                  />
                </PermissionGuard>
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
    </PermissionGuard>
  );
}
