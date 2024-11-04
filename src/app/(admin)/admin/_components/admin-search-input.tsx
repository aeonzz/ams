"use client";

import { CommandShortcut } from "@/components/ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import React from "react";

export default function AdminSearchInput() {
  const dialogManager = useDialogManager();
  return (
    <div
      onClick={() => dialogManager.setActiveDialog("adminCommandDialog")}
      className="ml-auto flex w-[280px] cursor-pointer rounded-md border bg-tertiary px-3 py-1.5 text-sm ring-offset-background"
    >
      <p className="text-sm text-muted-foreground">Search...</p>
      <div className="ml-auto flex gap-1">
        <CommandShortcut>Ctrl</CommandShortcut>
        <CommandShortcut>K</CommandShortcut>
      </div>
    </div>
  );
}
