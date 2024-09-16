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

interface JobRequestReviewerActionsProps {
  request: RequestWithRelations;
}

export default function JobRequestReviewerActions({
  request,
}: JobRequestReviewerActionsProps) {
  if (request.status !== "PENDING" && request.status !== "REVIEWED") {
    return null;
  }

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
  } = useQuery<UserWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get("/api/user/get-personnels");
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
          setIsOpen(false);
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
        toast.info("No changes made. The selected user is already assigned.");
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

  const renderPersonnelList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 p-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <P className="text-sm text-red-500">
            {error?.message || "An error occurred"}
          </P>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      );
    }

    return (
      <CommandGroup>
        {personnel?.map((item) => (
          <CommandItem
            key={item.id}
            onSelect={() => handleAssignPersonnel(item.id)}
            disabled={isAssignPersonnelPending}
          >
            <div className="flex w-full items-center">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage
                  src={item.profileUrl ?? ""}
                  alt={formatFullName(
                    item.firstName,
                    item.middleName,
                    item.lastName
                  )}
                />
                <AvatarFallback>
                  {item.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <P className="font-medium">
                  {formatFullName(
                    item.firstName,
                    item.middleName,
                    item.lastName
                  )}
                </P>
                <P className="text-sm text-muted-foreground">
                  {item.department?.name}
                </P>
              </div>
              {item.id === selectedPerson && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  return (
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
          <DialogTitle>Manage Job Request</DialogTitle>
          <DialogDescription>
            Review and take action on this job request.
          </DialogDescription>
        </DialogHeader>
        <div className="scroll-bar flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-1">
          <Command className="max-h-[250px]">
            <CommandInput placeholder="Search personnel..." />
            <CommandList>
              <CommandEmpty>No personnel found.</CommandEmpty>
              {renderPersonnelList()}
            </CommandList>
          </Command>
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
              <Button
                onClick={() => handleReview("REJECTED")}
                variant="destructive"
                disabled={
                  !selectedPerson ||
                  isUpdateStatusPending ||
                  isAssignPersonnelPending
                }
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          )}
          {request.status === "REVIEWED" && (
            <PermissionGuard
              allowedRoles={["REQUEST_APPROVER"]}
              allowedSection={request.jobRequest?.sectionId}
              currentUser={currentUser}
            >
              <JobRequestApproverActions
                request={request}
                isPending={isUpdateStatusPending || isAssignPersonnelPending}
              />
            </PermissionGuard>
          )}
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
  );
}
