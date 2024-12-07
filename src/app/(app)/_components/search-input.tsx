"use client";

import { CommandShortcut } from "@/components/ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

export default function SearchInput() {
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  return (
    <div
      onClick={() => dialogManager.setActiveDialog("commandDialog")}
      className="ml-auto flex w-[180px] cursor-pointer rounded-md border bg-tertiary px-3 py-1.5 text-sm ring-offset-background lg:w-[280px]"
    >
      <p className="text-sm text-muted-foreground">Search...</p>
      {isDesktop && (
        <div className="ml-auto flex gap-1">
          <CommandShortcut>Ctrl</CommandShortcut>
          <CommandShortcut>K</CommandShortcut>
        </div>
      )}
    </div>
  );
}
