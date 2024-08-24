"use client";

import * as React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Request } from "prisma/generated/zod";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface DeleteRequestDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  request: Row<Request>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteRequestDialog({
  request,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteRequestDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  // function onDelete() {
  //   startDeleteTransition(async () => {
  //     const { error } = await deleteTasks({
  //       ids: tasks.map((task) => task.id),
  //     })

  //     if (error) {
  //       toast.error(error)
  //       return
  //     }

  //     props.onOpenChange?.(false)
  //     toast.success("Tasks deleted")
  //     onSuccess?.()
  //   })
  // }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({request.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{request.length}</span>
            {request.length === 1 ? " task" : " tasks"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            // onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && <LoadingSpinner aria-hidden="true" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
