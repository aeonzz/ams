"use client";

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
import { completeJobRequest } from "@/lib/actions/job";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import React from "react";
import type { VerifyJobSchema } from "./schema";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface VerifyJobProps {
  jobRequestId: string;
  requestId: string;
  role: "reviewer" | "requester";
}

export default function VerifyJob({
  jobRequestId,
  role,
  requestId,
}: VerifyJobProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const { isPending, mutateAsync } =
    useServerActionMutation(completeJobRequest);

  async function handleUpdate() {
    const values: VerifyJobSchema = {
      jobRequestId: jobRequestId,
      path: pathname,
      role: role,
      verify: true,
    };

    toast.promise(mutateAsync(values), {
      loading: "Loading...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: [requestId] });
        return "Job verified successfully";
      },
      error: (err) => {
        console.error(err);
        return "Something went wrong, please try again later.";
      },
    });
  }

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={isPending}>
          Verify Job
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Verify job</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark the job as verifed? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleUpdate()}>
            Complete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
