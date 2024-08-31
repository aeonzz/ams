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
  type DialogType,
  useDialogManager,
} from "@/lib/hooks/use-dialog-manager";
import ReturnableResourceDialog from "@/components/dialogs/returnable-resource-dialog";

type ResourceType = {
  value: "Returnable" | "Consumable";
  label: string;
  icon: LucideIcon;
  dialog: DialogType;
};

const RequestTypes: ResourceType[] = [
  {
    value: "Returnable",
    label: "Equipments",
    icon: RotateCw,
    dialog: "returnableResourceDialog",
  },
  {
    value: "Consumable",
    label: "Materials",
    icon: Box,
    dialog: "consumableResourceDialog",
  },
];

export default function ResourceOption() {
  const dialogManager = useDialogManager();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <Dialog
        open={dialogManager.activeDialog === "resourceDialog"}
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
      <ReturnableResourceDialog />
    </>
  );
}
