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
  { name: "Profile", href: "/settings/profile" },
  { name: "Password", href: "/settings/password" },
  { name: "Preference", href: "/settings/preferences" },
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
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
