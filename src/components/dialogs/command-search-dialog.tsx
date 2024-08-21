"use client";

import { useEffect } from "react";
import {
  Mail,
  PaletteIcon,
  PanelRight,
  Plus,
  RocketIcon,
  Settings,
  Smile,
  UserRound,
} from "lucide-react";

import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface CommandSearchDialogProps {
  children: React.ReactNode;
}

export default function CommandSearchDialog({
  children,
}: CommandSearchDialogProps) {
  const dialogManager = useDialogManager();
  const sidebar = useSidebarToggle();
  const router = useRouter();

  useHotkeys(
    "mod+k",
    (event) => {
      event.preventDefault();
      if (!dialogManager.isAnyDialogOpen()) {
        dialogManager.setActiveDialog("commandDialog");
      }
    },
    { enableOnFormTags: true }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <CommandDialog
        open={dialogManager.activeDialog === "commandDialog"}
        onOpenChange={handleOpenChange}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Request">
            <CommandItem
              onSelect={() => {
                dialogManager.setActiveDialog("requestDialog");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Create request</span>
              <div className="ml-auto space-x-1">
                <CommandShortcut>C</CommandShortcut>
              </div>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                dialogManager.setActiveDialog("settingsDialog");
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                dialogManager.setActiveDialog("themeCommand");
              }}
            >
              <PaletteIcon className="mr-2 h-4 w-4" />
              <span>Change theme</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Miscellaneous">
            <CommandItem
              onSelect={() => {
                dialogManager.setActiveDialog(null);
                sidebar.setIsOpen();
              }}
            >
              <PanelRight className="mr-2 h-4 w-4" />
              <span>Collapse navigation sidebar</span>
              <CommandShortcut>[</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      {children}
    </>
  );
}
