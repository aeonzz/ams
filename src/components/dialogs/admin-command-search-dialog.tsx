"use client";

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
import { useHotkeys } from "react-hotkeys-hook";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface AdminCommandSearchDialogProps {
  children: React.ReactNode;
}

export default function AdminCommandSearchDialog({
  children,
}: AdminCommandSearchDialogProps) {
  const dialogManager = useDialogManager();
  const sidebar = useSidebarToggle();

  useHotkeys(
    "mod+k",
    (event) => {
      event.preventDefault();
      if (!dialogManager.isAnyDialogOpen()) {
        dialogManager.setActiveDialog("adminCommandDialog");
      }
    },
    { enableOnFormTags: false }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <CommandDialog
        open={dialogManager.activeDialog === "adminCommandDialog"}
        onOpenChange={handleOpenChange}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Settings">
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
