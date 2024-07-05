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
import { FileUploader } from '../forms/file-uploader';
import { useUploadFile } from '@/lib/hooks/use-upload-file';
import { UploadedFilesCard } from '../card/uploaded-files-card';

export default function UploadProfileDialog() {
  const dialog = useDialog();
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    'imageUploader',
    { defaultUploadedFiles: [] }
  );
  return (
    <Dialog
      open={dialog.activeDialog === 'uploadImageDialog'}
      onOpenChange={(open) =>
        dialog.setActiveDialog(open ? 'uploadImageDialog' : '')
      }
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
        <FileUploader
          maxFiles={1}
          maxSize={10 * 1024 * 1024}
          progresses={progresses}
          onUpload={uploadFiles}
          disabled={isUploading}
        />
        {/* <UploadedFilesCard uploadedFiles={uploadedFiles} /> */}
      </DialogContent>
    </Dialog>
  );
}
