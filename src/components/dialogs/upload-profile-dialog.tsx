'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageUp } from 'lucide-react';
import { Button } from '../ui/button';
import { useDialog } from '@/lib/hooks/use-dialog';
import ImageUploader from '../ui/image-uploader';

export default function UploadProfileDialog() {
  const dialog = useDialog();
  return (
    <Dialog
      open={dialog.activeDialog === 'uploadImageDialog'}
      onOpenChange={(open) => dialog.setActiveDialog(open ? 'uploadImageDialog' : '')}
    >
      <DialogTrigger asChild>
        <Button
          variant="expandIcon"
          Icon={ImageUp}
          iconPlacement="right"
          size="sm"
        >
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Upload files Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <ImageUploader />
      </DialogContent>
    </Dialog>
  );
}
