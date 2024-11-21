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
import { CarFront, Lightbulb, LucideIcon, Theater, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogState,
  type DialogType,
  useDialogManager,
} from "@/lib/hooks/use-dialog-manager";
import { useHotkeys } from "react-hotkeys-hook";
import JobDialog from "@/components/dialogs/job-dialog";
import VenueDialog from "@/components/dialogs/venue-dialog";
import TransportDialog from "@/components/dialogs/transport-dialog";
import ResourceOption from "./resource-option";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "usehooks-ts";

type ReqType = {
  value: "JOB" | "VENUE" | "RESOURCE" | "TRANSPORT";
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
    dialog: "resourceDialog",
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
  const isDesktop = useMediaQuery("(min-width: 769px)");

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

  if (isDesktop) {
    return (
      <>
        <Dialog
          open={dialogManager.activeDialog === "requestDialog"}
          onOpenChange={handleOpenChange}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
              <Component dialogManager={dialogManager} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <JobDialog />
        <VenueDialog />
        <TransportDialog />
        <ResourceOption />
      </>
    );
  }

  return (
    <>
      <Sheet
        open={dialogManager.activeDialog === "requestDialog"}
        onOpenChange={handleOpenChange}
      >
        <SheetContent className="rounded-t-[10px]" side="bottom" hideClose>
          <SheetHeader className="text-left">
            <SheetTitle>New Request</SheetTitle>
            <Component dialogManager={dialogManager} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <JobDialog />
      <VenueDialog />
      <TransportDialog />
      <ResourceOption />
    </>
  );
}

function Component({
  className,
  dialogManager,
}: {
  className?: React.ComponentProps<"div">;
  dialogManager: DialogState;
}) {
  return (
    <div className="grid h-full grid-flow-row grid-cols-2 place-items-center gap-4 pb-4 lg:grid-cols-4">
      {RequestTypes.map(({ icon: Icon, ...type }, index) => (
        <Button
          key={index}
          variant="ringHover"
          onClick={() => dialogManager.setActiveDialog(type.dialog)}
          className="aspect-square h-32 w-full flex-col bg-secondary-accent lg:h-44"
        >
          <Icon className="size-12 text-muted-foreground" />
          {type.label}
        </Button>
      ))}
    </div>
  );
}
