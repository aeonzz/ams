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
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { CarFront, Lightbulb, LucideIcon, Theater, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type DialogType,
  useDialogManager,
} from "@/lib/hooks/use-dialog-manager";
import { useHotkeys } from "react-hotkeys-hook";
import JobDialog from "@/components/dialogs/job-dialog";
import VenueDialog from "@/components/dialogs/venue-dialog";
import TransportDialog from "@/components/dialogs/transport-dialog";
import ReturnableResourceDialog from "@/components/dialogs/returnable-resource-dialog";

export type ReqType = {
  value: RequestTypeType;
  label: string;
  icon: LucideIcon;
  dialog: DialogType;
};

const RequestTypes: ReqType[] = [
  {
    value: "JOB",
    label: "Job",
    icon: Wrench,
    dialog: "jobDialog",
  },
  {
    value: "VENUE",
    label: "Venue",
    icon: Theater,
    dialog: "venueDialog",
  },
  {
    value: "RESOURCE",
    label: "Resource",
    icon: Lightbulb,
    dialog: "returnableResourceDialog",
  },
  {
    value: "TRANSPORT",
    label: "Transport",
    icon: CarFront,
    dialog: "transportDialog",
  },
];

export default function RequestOption() {
  const dialogManager = useDialogManager();

  useHotkeys(
    "c",
    () => {
      if (!dialogManager.isAnyDialogOpen()) {
        dialogManager.setActiveDialog("requestDialog");
      }
    },
    { enableOnFormTags: false }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <Dialog
        open={dialogManager.activeDialog === "requestDialog"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Request</DialogTitle>
            <div className="flex h-full items-center space-x-4 pb-4">
              {RequestTypes.map(({ icon: Icon, ...type }, index) => (
                <Button
                  key={index}
                  variant="ringHover"
                  onClick={() => dialogManager.setActiveDialog(type.dialog)}
                  className="aspect-square h-auto flex-1 flex-col gap-2 bg-secondary-accent"
                >
                  <Icon className="size-12 text-muted-foreground" />
                  {type.label}
                </Button>
              ))}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <JobDialog />
      <VenueDialog />
      <TransportDialog />
      <ReturnableResourceDialog />
    </>
  );
}
