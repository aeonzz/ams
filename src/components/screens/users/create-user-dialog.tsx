"use client";

import { useEffect, useState } from "react";

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
import { PlusIcon, X } from "lucide-react";
import CreateUserForm from "@/components/forms/create-user-form";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createUser } from "@/lib/actions/users";
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
import { createUserSchema, CreateUserSchema } from "@/lib/schema/client/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-hook-form";

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutate, isPending } = useServerActionMutation(createUser, {
    onSuccess: () => {
      setOpen(false);
      toast.success("User Created Successfully!", {
        description: "The new user has been created successfully.",
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New user
        </Button>
      </DialogTrigger>
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
              <AlertDialogAction onClick={() => setOpen(false)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm
          mutate={mutate}
          isPending={isPending}
          isFieldsDirty={isFieldsDirty}
          setAlertOpen={setAlertOpen}
          setIsOpen={setOpen}
          form={form}
        />
      </DialogContent>
    </Dialog>
  );
}
