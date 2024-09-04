"use client";

import React from "react";
import {
  ArrowRight,
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

const NavigationLinks = [
  { name: "Go to notifications", href: "/notification" },
  {
    name: "Go to my requests",
    href: "/requests/my-requests?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to pending requests",
    href: "/requests/my-requests?page=1&per_page=10&sort=createdAt.desc&status=PENDING",
  },
  { name: "Go to my reservations", href: "/reservations/my-reservations" },
];

interface CommandSearchDialogProps {
  children: React.ReactNode;
}

export default function CommandSearchDialog({
  children,
}: CommandSearchDialogProps) {
  const dialogManager = useDialogManager();
  const sidebar = useSidebarToggle();
  const router = useRouter();

  React.useEffect(() => {
    NavigationLinks.forEach((link) => {
      router.prefetch(link.href);
    });
  }, [router]);

  useHotkeys(
    "mod+k",
    (event) => {
      event.preventDefault();
      if (!dialogManager.isAnyDialogOpen()) {
        dialogManager.setActiveDialog("commandDialog");
      }
    },
    { enableOnFormTags: false }
  );

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
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            {NavigationLinks.map((link) => (
              <CommandItem
                key={link.name}
                onSelect={() => handleSelect(link.href)}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                <span>{link.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
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
          <CommandSeparator />
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
