"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { roleSchema, type RoleSchema } from "@/lib/schema/role";
import CreateRoleForm from "./create-role-form";
import { createRole } from "@/lib/actions/role";

export default function CreateRoleDialog() {
  const dialogManager = useDialogManager();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(createRole);

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
      open={dialogManager.activeDialog === "adminCreateRoleDialog"}
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
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a role to the system.
          </DialogDescription>
        </DialogHeader>
        <CreateRoleForm
          mutateAsync={mutateAsync}
          isPending={isPending}
          setAlertOpen={setAlertOpen}
          form={form}
          isFieldsDirty={isFieldsDirty}
          dialogManager={dialogManager}
        />
      </DialogContent>
    </Dialog>
  );
}
