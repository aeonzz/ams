"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Box, type LucideIcon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogState,
  type DialogType,
  useDialogManager,
} from "@/lib/hooks/use-dialog-manager";
import ReturnableResourceDialog from "@/components/dialogs/returnable-resource-dialog";
import SupplyResourceDialog from "@/components/dialogs/supply-resource-dialog";
import { useMediaQuery } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ResourceType = {
  value: "Returnable" | "Consumable";
  label: string;
  icon: LucideIcon;
  dialog: DialogType;
};

const RequestTypes: ResourceType[] = [
  {
    value: "Returnable",
    label: "Borrow Request",
    icon: RotateCw,
    dialog: "returnableResourceDialog",
  },
  {
    value: "Consumable",
    label: "Supplies Request",
    icon: Box,
    dialog: "supplyResourceDialog",
  },
];

export default function ResourceOption() {
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const dialogManager = useDialogManager();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  if (isDesktop) {
    return (
      <>
        <Dialog
          open={dialogManager.activeDialog === "resourceDialog"}
          onOpenChange={handleOpenChange}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
              <Component dialogManager={dialogManager} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <ReturnableResourceDialog />
        <SupplyResourceDialog />
      </>
    );
  }

  return (
    <>
      <Sheet
        open={dialogManager.activeDialog === "resourceDialog"}
        onOpenChange={handleOpenChange}
      >
        <SheetContent className="rounded-t-[10px]" side="bottom" hideClose>
          <SheetHeader className="text-left">
            <SheetTitle>Resource Request</SheetTitle>
            <Component dialogManager={dialogManager} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ReturnableResourceDialog />
      <SupplyResourceDialog />
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
  );
}
