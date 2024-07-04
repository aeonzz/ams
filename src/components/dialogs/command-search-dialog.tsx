'use client';

import {
  Mail,
  PanelRight,
  Plus,
  RocketIcon,
  Settings,
  Smile,
  UserRound,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useEffect } from 'react';
import { useSidebarToggle } from '@/lib/hooks/use-sidebar-toggle';
import { useDialog } from '@/lib/hooks/use-dialog';

export default function CommandSearchDialog() {
  const dialog = useDialog();
  const sidebar = useSidebarToggle();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dialog.setActiveDialog('commandDialog');
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandDialog
      open={dialog.activeDialog === 'commandDialog'} 
      onOpenChange={(open) => dialog.setActiveDialog(open ? 'commandDialog' : '')}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Request">
            <CommandItem
              onSelect={() => {
                dialog.setActiveDialog('requestDialog');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Create request</span>
              <div className="ml-auto space-x-1">
                <CommandShortcut>Ctrl</CommandShortcut>
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
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Miscellaneous">
            <CommandItem onSelect={() => sidebar.setIsOpen()}>
              <PanelRight className="mr-2 h-4 w-4" />
              <span>Collapse navigation sidebar</span>
              <CommandShortcut>[</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
