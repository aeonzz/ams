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
import { useForm, UseFormReturn, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { DialogState, useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createVenueRequest } from "@/lib/actions/requests";
import VenueRequestInput from "@/app/(app)/dashboard/_components/venue-request-input";
import {
  venueRequestSchema,
  type VenueRequestSchema,
} from "@/lib/schema/request";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export default function VenueDialog() {
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<VenueRequestSchema>({
    resolver: zodResolver(venueRequestSchema),
    defaultValues: {
      venueId: "",
      notes: "",
      startTime: undefined,
      endTime: undefined,
      purpose: "",
      setupRequirements: [],
    },
  });

  const venueId = form.watch("venueId");
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } =
    useServerActionMutation(createVenueRequest);

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
        open={dialogManager.activeDialog === "venueDialog"}
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
          className={cn(venueId ? "max-w-3xl" : "")}
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
              <DialogTitle>Venue Request</DialogTitle>
            </DialogHeader>
          </Component>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet
      open={dialogManager.activeDialog === "venueDialog"}
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
            <SheetTitle>Venue Request</SheetTitle>
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
  form: UseFormReturn<VenueRequestSchema>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createVenueRequest>[0],
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
      <VenueRequestInput
        mutateAsync={mutateAsync}
        isPending={isPending}
        form={form}
        type="VENUE"
        handleOpenChange={handleOpenChange}
        isFieldsDirty={isFieldsDirty}
      />
    </>
  );
}
