"use client";

import React from "react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeTransportRequest } from "@/lib/actions/requests";
import { useQueryClient } from "@tanstack/react-query";
import type { TransportRequestActions } from "@/lib/schema/request/transport";
import NumberInput from "@/components/number-input";

interface CompleteTransportRequestProps {
  requestId: string;
  initialOdometer: number;
}

export default function CompleteTransportRequest({
  requestId,
  initialOdometer,
}: CompleteTransportRequestProps) {
  const [open, setOpen] = React.useState(false);
  const [odometer, setOdometer] = React.useState<number>(initialOdometer);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useServerActionMutation(
    completeTransportRequest
  );

  async function handleUpdate(status: RequestStatusTypeType) {
    if (odometer === initialOdometer || odometer === 0) {
      toast.error("Please enter the odometer reading.");
      return;
    }

    const data: TransportRequestActions = {
      path: pathname,
      requestId: requestId,
      status: status,
      odometer: odometer,
    };

    toast.promise(mutateAsync(data), {
      loading: "Marking transport request as completed...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: [requestId] });
        return "The transport request has been marked as completed successfully.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOdometer(initialOdometer);
    }
    setOpen(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending}>Mark as Completed</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this transport request as completed?
            This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="odometer">Odometer Reading</Label>
          <NumberInput
            value={odometer}
            min={0}
            disabled={isPending}
            onChange={setOdometer}
            className="w-full justify-between"
            isDecimal={true}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleUpdate("COMPLETED")}
            disabled={
              isPending ||
              odometer === initialOdometer ||
              odometer === initialOdometer
            }
          >
            Mark as Completed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
