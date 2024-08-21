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
  { name: "Light", value: "light", icon: Sun, cmd: "1" },
  { name: "Dark", value: "dark", icon: Moon, cmd: "2" },
  { name: "Blue", value: "blue", icon: SunMoon, cmd: "3" },
  { name: "System", value: "system", icon: SunMoon, cmd: "4" },
];

export default function ThemeDialog() {
  const dialogManager = useDialogManager();
  const { setTheme, theme } = useTheme();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  themes.forEach((item) => {
    useHotkeys(
      item.cmd,
      () => {
        if (dialogManager.activeDialog === "themeCommand") {
          setTheme(item.value);
          dialogManager.setActiveDialog(null);
        }
      },
      { enableOnFormTags: true }
    );
  });

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
              <div className="ml-auto flex space-x-2">
                {item.value === theme && <Check />}
                <CommandShortcut>{item.cmd}</CommandShortcut>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
