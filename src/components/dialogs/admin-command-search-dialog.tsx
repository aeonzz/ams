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
import { useHotkeys } from "react-hotkeys-hook";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { useStore } from "@/lib/hooks/use-store";

const NavigationLinks = [
  {
    name: "Go to requests",
    href: "/admin/requests?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to users",
    href: "/admin/users?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to departments",
    href: "/admin/departments?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to role management",
    href: "/admin/role-management?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to facilities",
    href: "/admin/role-venues?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to vehicles",
    href: "/admin/vehicles?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to lendable items",
    href: "/admin/inventory/lendable-items?page=1&per_page=10&sort=createdAt.desc",
  },
  {
    name: "Go to supply items",
    href: "/admin/inventory/supply-items?page=1&per_page=10&sort=createdAt.desc",
  },
];

interface AdminCommandSearchDialogProps {
  children: React.ReactNode;
}

export default function AdminCommandSearchDialog({
  children,
}: AdminCommandSearchDialogProps) {
  const router = useRouter();
  const dialogManager = useDialogManager();
  const sidebar = useStore(useSidebar, (x) => x);

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

  const handleSelect = (href: string) => {
    dialogManager.setActiveDialog(null);
    router.push(href);
  };

  React.useEffect(() => {
    NavigationLinks.forEach((link) => {
      router.prefetch(link.href);
    });
  }, [router]);

  if (!sidebar) return null;

  return (
    <>
      <CommandDialog
        open={dialogManager.activeDialog === "adminCommandDialog"}
        onOpenChange={handleOpenChange}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
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
                dialogManager.setActiveDialog("adminSettingsDialog");
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
