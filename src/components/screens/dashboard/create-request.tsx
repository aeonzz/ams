'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDialog } from '@/lib/hooks/use-dialog';

export default function CreateRequest() {
  const dialog = useDialog();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dialog.setActiveDialog('requestDialog');
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog 
      open={dialog.activeDialog === 'requestDialog'} 
      onOpenChange={(open) => dialog.setActiveDialog(open ? 'requestDialog' : '')}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
