"use client";

import React, { useEffect, useState } from "react";

import { useDialog } from "@/lib/hooks/use-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Lightbulb,
  LucideIcon,
  Theater,
  Wrench,
  X,
} from "lucide-react";
import JobRequestInput from "./job-request-input";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { useIsFormDirty } from "@/lib/hooks/use-form-dirty";
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

export type ReqType = {
  value: RequestTypeType;
  label: string;
  icon: LucideIcon;
};

const RequestTypes: ReqType[] = [
  {
    value: "JOB",
    label: "Job",
    icon: Wrench,
  },
  {
    value: "VENUE",
    label: "Venue",
    icon: Theater,
  },
  {
    value: "RESOURCE",
    label: "Resource",
    icon: Lightbulb,
  },
];

export default function CreateRequest() {
  const dialog = useDialog();
  const { isFormDirty } = useIsFormDirty();
  const [type, setType] = useState<ReqType | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "c" &&
        e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        dialog.setActiveDialog("requestDialog");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog
      open={dialog.activeDialog === "requestDialog"}
      onOpenChange={(open) => {
        dialog.setActiveDialog(open ? "requestDialog" : "");

        if (!open) {
          setTimeout(() => {
            setType(null);
          }, 350);
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (isFormDirty) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
        className="max-w-3xl"
      >
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          {isFormDirty && (
            <AlertDialogTrigger asChild>
              <button className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none">
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
                  dialog.setActiveDialog("");
                  setTimeout(() => {
                    setType(null);
                  }, 350);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {type?.value === "JOB" ? (
          <JobRequestInput setType={setType} type={type} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
              <div className="flex h-full items-center space-x-4 pb-4">
                {RequestTypes.map(({ icon: Icon, ...type }, index) => (
                  <Button
                    key={index}
                    variant="ringHover"
                    onClick={() => setType({ icon: Icon, ...type })}
                    className="aspect-square h-auto flex-1 flex-col gap-2 bg-secondary-accent"
                  >
                    <Icon className="size-12 text-muted-foreground" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
