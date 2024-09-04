"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { Cog } from "lucide-react";

const settingLinks = [
  { name: "Profile", href: "/settings/profile" },
  { name: "Password", href: "/settings/password" },
  { name: "Preference", href: "/settings/preferences" },
];

export default function SettingsDialog() {
  const dialogManager = useDialogManager();
  const router = useRouter();

  React.useEffect(() => {
    settingLinks.forEach((link) => {
      router.prefetch(link.href);
    });
  }, [router]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  const handleSelect = (href: string) => {
    dialogManager.setActiveDialog(null);
    router.push(href);
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
              onSelect={() => handleSelect(item.href)}
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
