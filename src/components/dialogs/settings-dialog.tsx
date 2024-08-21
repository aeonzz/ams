"use client";

import React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useRouter } from "next/navigation";
import { Cog } from "lucide-react";

const settingLinks = [
  { name: "Profile", href: "/settings/profile", cmd: "1" },
  { name: "Password", href: "/settings/password", cmd: "2" },
  { name: "Preference", href: "/settings/preferences", cmd: "3" },
];

export default function SettingsDialog() {
  const dialogManager = useDialogManager();
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <CommandDialog
      open={dialogManager.activeDialog === "settingsDialog"}
      onOpenChange={handleOpenChange}
    >
      <CommandInput placeholder="Change theme..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Themes">
          {settingLinks.map((item) => (
            <CommandItem
              key={item.name}
              onSelect={() => {
                dialogManager.setActiveDialog(null);
                router.push(item.href);
              }}
            >
              <Cog className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
              <CommandShortcut>{item.cmd}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
