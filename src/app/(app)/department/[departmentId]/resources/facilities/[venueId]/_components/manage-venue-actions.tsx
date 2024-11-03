"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Circle, EllipsisVertical, FileClock, Pencil } from "lucide-react";
import Link from "next/link";
import { UpdateVenueSheet } from "@/app/(admin)/admin/venues/_components/update-venue-sheet";
import { useHotkeys } from "react-hotkeys-hook";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { VenueWithRelations } from "prisma/generated/zod";
import { CommandShortcut } from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import UploadRulesPdfDialog from "./upload-rules-pdf-dialog";

interface ManageVenueActionsProps {
  venueId: string;
  departmentId: string;
  data: VenueWithRelations;
}

export default function ManageVenueActions({
  venueId,
  departmentId,
  data,
}: ManageVenueActionsProps) {
  const dialogManager = useDialogManager();

  const isUpdateSheetOpen =
    dialogManager.activeDialog === "adminUpdateVenueSheet";

  useHotkeys(
    "e",
    (event) => {
      if (!dialogManager.isAnyDialogOpen()) {
        event.preventDefault();
        dialogManager.setActiveDialog("adminUpdateVenueSheet");
      }
    },
    { enableOnFormTags: false }
  );

  useHotkeys(
    "r",
    (event) => {
      if (!dialogManager.isAnyDialogOpen()) {
        event.preventDefault();
        dialogManager.setActiveDialog("uploadFileDialog");
      }
    },
    { enableOnFormTags: false }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  const MemoizedUpdateVenueSheet = React.useMemo(
    () => (
      <UpdateVenueSheet
        open={isUpdateSheetOpen}
        onOpenChange={handleOpenChange}
        queryKey={[venueId]}
        removeField
        venue={data}
      />
    ),
    [isUpdateSheetOpen, venueId, data]
  );

  const MemoizedDropdownContent = React.useMemo(
    () => (
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() =>
            dialogManager.setActiveDialog("adminUpdateVenueSheet")
          }
        >
          <Pencil className="mr-2 size-4" />
          Edit
          <DropdownMenuShortcut>
            <CommandShortcut>E</CommandShortcut>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            dialogManager.setActiveDialog("updateVenueStatusCommand")
          }
        >
          <Circle className="mr-2 size-4" />
          Status
          <DropdownMenuShortcut>
            <CommandShortcut>S</CommandShortcut>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => dialogManager.setActiveDialog("uploadFileDialog")}
        >
          <Circle className="mr-2 size-4" />
          Venue Policies
          <DropdownMenuShortcut>
            <CommandShortcut>R</CommandShortcut>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    ),
    [departmentId, venueId, dialogManager]
  );

  return (
    <>
      {MemoizedUpdateVenueSheet}

      <Dialog
        open={dialogManager.activeDialog === "uploadFileDialog"}
        onOpenChange={handleOpenChange}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost2" size="icon">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          {MemoizedDropdownContent}
        </DropdownMenu>
        <UploadRulesPdfDialog
          file={data.rulesAndRegulations}
          venueId={venueId}
          open={dialogManager.activeDialog === "uploadFileDialog"}
          setOpen={handleOpenChange}
        />
      </Dialog>
    </>
  );
}
