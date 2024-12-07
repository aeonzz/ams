"use client";

import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import React from "react";
import type { UpdateRequestStatusSchemaWithPath } from "./schema";
import { usePathname } from "next/navigation";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
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
import { completeVenueRequest } from "@/lib/actions/requests";
import { useQueryClient } from "@tanstack/react-query";
import { PermissionGuard } from "@/components/permission-guard";
import { useSession } from "@/lib/hooks/use-session";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface CompleteVenueRequestProps {
  requestId: string;
  departmentId: string;
}

export default function CompleteVenueRequest({
  requestId,
  departmentId,
}: CompleteVenueRequestProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { mutateAsync, isPending } =
    useServerActionMutation(completeVenueRequest);

  async function handleUpdate(status: RequestStatusTypeType) {
    const data: UpdateRequestStatusSchemaWithPath = {
      path: pathname,
      requestId: requestId,
      status: status,
    };

    toast.promise(mutateAsync(data), {
      loading: "Marking reservation as completed...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: [requestId] });
        return "The reservation has been marked as completed successfully.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <PermissionGuard
      allowedRoles={["OPERATIONS_MANAGER"]}
      allowedDepartment={departmentId}
      currentUser={currentUser}
    >
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending} onClick={() => setIsDialogOpen(true)}>
            Mark as Completed
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Mark as Completed</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this venue reservation as completed?
              This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleUpdate("COMPLETED");
              }}
            >
              Mark as Completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PermissionGuard>
  );
}
