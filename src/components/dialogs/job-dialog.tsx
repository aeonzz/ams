"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useForm, UseFormReturn, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogState, useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createJobRequest } from "@/lib/actions/job";
import {
  createjobRequestSchema,
  type CreateJobRequestSchema,
} from "@/app/(app)/dashboard/_components/schema";
import { X } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export default function JobDialog() {
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<CreateJobRequestSchema>({
    resolver: zodResolver(createjobRequestSchema),
    defaultValues: {
      description: "",
      location: "",
      images: undefined,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(createJobRequest);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  React.useEffect(() => {
    form.reset();
  }, [dialogManager.activeDialog]);

  if (isDesktop) {
    return (
      <Dialog
        open={dialogManager.activeDialog === "jobDialog"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent
          onInteractOutside={(e) => {
            if (isPending) {
              e.preventDefault();
            }
            if (isFieldsDirty && !isPending) {
              e.preventDefault();
              setAlertOpen(true);
            }
          }}
          isLoading={isPending}
        >
          <Component
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            isFieldsDirty={isFieldsDirty}
            isPending={isPending}
            dialogManager={dialogManager}
            form={form}
            mutateAsync={mutateAsync}
            handleOpenChange={handleOpenChange}
          >
            <DialogHeader>
              <DialogTitle>Job Request</DialogTitle>
            </DialogHeader>
          </Component>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={dialogManager.activeDialog === "jobDialog"}
      onOpenChange={handleOpenChange}
    >
      <DrawerContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
          if (isFieldsDirty && !isPending) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
      >
        <Component
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          isFieldsDirty={isFieldsDirty}
          isPending={isPending}
          dialogManager={dialogManager}
          form={form}
          mutateAsync={mutateAsync}
          handleOpenChange={handleOpenChange}
        >
          <DrawerHeader>
            <DrawerTitle>Job Request</DrawerTitle>
          </DrawerHeader>
        </Component>
      </DrawerContent>
    </Drawer>
  );
}

function Component({
  children,
  alertOpen,
  setAlertOpen,
  isFieldsDirty,
  isPending,
  dialogManager,
  form,
  mutateAsync,
  handleOpenChange,
}: {
  children: React.ReactNode;
  alertOpen: boolean;
  setAlertOpen: (alertOpen: boolean) => void;
  isFieldsDirty: boolean;
  isPending: boolean;
  dialogManager: DialogState;
  form: UseFormReturn<CreateJobRequestSchema>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createJobRequest>[0],
    unknown
  >;
  handleOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        {isFieldsDirty && !isPending && (
          <AlertDialogTrigger disabled={isPending} asChild>
            <button
              disabled={isPending}
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
      {children}
      <JobRequestInput
        form={form}
        isPending={isPending}
        mutateAsync={mutateAsync}
        type="JOB"
        handleOpenChange={handleOpenChange}
        isFieldsDirty={isFieldsDirty}
      />
    </>
  );
}
