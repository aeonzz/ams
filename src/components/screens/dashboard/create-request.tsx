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
import { useCreateRequest } from '@/hooks/use-create-request';

export default function CreateRequest() {
  const createRequest = useCreateRequest();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'c' && !e.shiftKey) || (e.key === 'C' && !e.shiftKey)) {
        e.preventDefault();
        createRequest.setIsOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={createRequest.isOpen} onOpenChange={createRequest.setIsOpen}>
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
