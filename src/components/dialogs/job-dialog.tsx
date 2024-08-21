"use client";

import React from "react";

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
import JobRequestInput from "@/app/(app)/dashboard/_components/job-request-input";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Request, RequestSchema } from "@/lib/db/schema/request";
import { X } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

export default function JobDialog() {
  const dialogManager = useDialogManager();
  const [isLoading, setIsLoading] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<Request>({
    resolver: zodResolver(RequestSchema),
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  React.useEffect(() => {
    form.reset();
  }, [dialogManager.activeDialog]);

  return (
    <Dialog
      open={dialogManager.activeDialog === "jobDialog"}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
          if (isFieldsDirty && !isLoading) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
        className="max-w-3xl"
        isLoading={isLoading}
      >
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          {isFieldsDirty && isLoading && (
            <AlertDialogTrigger disabled={isLoading} asChild>
              <button
                disabled={isLoading}
                className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none"
              >
                <X className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  dialogManager.setActiveDialog(null);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <JobRequestInput
          form={form}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          type="JOB"
          dialogManager={dialogManager}
        />
      </DialogContent>
    </Dialog>
  );
}
