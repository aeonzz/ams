"use client";

import { Check, Moon, Smile, Sun, SunMoon } from "lucide-react";

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
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";

const themes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "Blue", value: "blue", icon: SunMoon },
  { name: "System", value: "system", icon: SunMoon },
];

export default function ThemeDialog() {
  const dialogManager = useDialogManager();
  const { setTheme, theme } = useTheme();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <CommandDialog
      open={dialogManager.activeDialog === "themeCommand"}
      onOpenChange={handleOpenChange}
    >
      <CommandInput placeholder="Change theme..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Themes">
          {themes.map((item) => (
            <CommandItem
              key={item.value}
              onSelect={() => {
                setTheme(item.value);
                dialogManager.setActiveDialog(null);
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
              {item.value === theme && <Check className="ml-auto" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
