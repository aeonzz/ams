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
import { useForm, UseFormReturn, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { DialogState, useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  returnableResourceRequestSchema,
  type ReturnableResourceRequestSchema,
} from "@/lib/schema/resource/returnable-resource";
import ReturnableResourceRequestInput from "@/app/(app)/dashboard/_components/returnable-resource-request-input";
import { createReturnableResourceRequest } from "@/lib/actions/resource";
import { cn } from "@/lib/utils";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export default function ReturnableResourceDialog() {
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<ReturnableResourceRequestSchema>({
    resolver: zodResolver(returnableResourceRequestSchema),
    defaultValues: {
      itemId: undefined,
      location: "",
      notes: "",
      dateAndTimeNeeded: undefined,
      returnDateAndTime: undefined,
      purpose: "",
    },
  });

  const itemid = form.watch("itemId");
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(
    createReturnableResourceRequest
  );

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
        open={dialogManager.activeDialog === "returnableResourceDialog"}
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
            isDesktop={isDesktop}
          >
            <DialogHeader>
              <DialogTitle>Borrow Request</DialogTitle>
            </DialogHeader>
          </Component>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet
      open={dialogManager.activeDialog === "returnableResourceDialog"}
      onOpenChange={handleOpenChange}
    >
      <SheetContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
          if (isFieldsDirty && !isPending) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
        className="rounded-t-[10px]"
        side="bottom"
        hideClose
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
          isDesktop={isDesktop}
        >
          <SheetHeader>
            <SheetTitle>Borrow Request</SheetTitle>
          </SheetHeader>
        </Component>
      </SheetContent>
    </Sheet>
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
  isDesktop,
}: {
  children: React.ReactNode;
  alertOpen: boolean;
  setAlertOpen: (alertOpen: boolean) => void;
  isFieldsDirty: boolean;
  isPending: boolean;
  dialogManager: DialogState;
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createReturnableResourceRequest>[0],
    unknown
  >;
  handleOpenChange: (open: boolean) => void;
  isDesktop: boolean;
}) {
  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        {isDesktop && isFieldsDirty && !isPending && (
          <AlertDialogTrigger disabled={isPending} asChild>
            <button
              disabled={isPending}
              className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none"
            >
              <X className="h-5 w-5" />
            </button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent
          className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
        >
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
      <ReturnableResourceRequestInput
        mutateAsync={mutateAsync}
        isPending={isPending}
        form={form}
        type="BORROW"
        handleOpenChange={handleOpenChange}
        isFieldsDirty={isFieldsDirty}
      />
    </>
  );
}
