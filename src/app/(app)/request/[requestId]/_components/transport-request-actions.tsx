"use client";

import React from "react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateTransportRequest } from "@/lib/actions/requests";
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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { TransportRequestWithRelations } from "prisma/generated/zod";
import { usePathname } from "next/navigation";
import { P } from "@/components/typography/text";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/number-input";

interface TransportRequestActionsProps {
  data: TransportRequestWithRelations;
  children: React.ReactNode;
}

export default function TransportRequestActions({
  data,
  children,
}: TransportRequestActionsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [odometer, setOdometer] = React.useState<number>(data.vehicle.odometer);
  const { mutateAsync, isPending } = useServerActionMutation(
    updateTransportRequest
  );

  async function handleUpdate() {
    if (odometer === 0) {
      toast.error(
        "Odometer reading is required before starting the transport."
      );
      return;
    }

    toast.promise(
      mutateAsync({
        id: data.requestId,
        path: pathname,
        inProgress: true,
        odometerStart: odometer,
        actualStart: new Date(),
        vehicleStatus: "IN_USE",
      }),
      {
        loading: "Loading...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [data.requestId] });
          return "The transport request has been started successfully.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  }

  return (
    <>
      <div>
        <P className="text-xs text-muted-foreground">
          Vehicle odometer reading:
        </P>
        <div className="flex w-full items-center p-2">
          <P className="font-medium">{data.vehicle.odometer}</P>
        </div>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button disabled={isPending} onClick={() => setIsAlertOpen(true)}>
            Start Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Start Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start this transport request? This action
              will update the status to &quot;In Progress&quot; and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-4">
            <Label htmlFor="odometer" className="mb-2 block">
              Actual odometer reading <span className="text-red-500">*</span>
            </Label>
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
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsAlertOpen(true)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending || odometer === 0}
              onClick={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              Start Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </>
  );
}
