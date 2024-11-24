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
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useStore } from "@/lib/hooks/use-store";
import { useSidebar } from "@/lib/hooks/use-sidebar";

const NavigationLinks = [
  { name: "Go to notifications", href: "/notification" },
  {
    name: "Go to my requests",
    href: "/request/my-requests?page=1&per_page=10&sort=createdAt.desc",
  },
];

interface CommandSearchDialogProps {
  children: React.ReactNode;
}

export default function CommandSearchDialog({
  children,
}: CommandSearchDialogProps) {
  const sidebar = useStore(useSidebar, (x) => x);

  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");
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

  if (!sidebar) return null;

  return (
    <>
      <CommandDialog
        open={dialogManager.activeDialog === "commandDialog"}
        onOpenChange={handleOpenChange}
        className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
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
                sidebar.toggleOpen();
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
