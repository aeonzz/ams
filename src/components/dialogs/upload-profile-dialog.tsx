"use client";

import React, { useState } from "react";
import { ImageUp } from "lucide-react";

import { useDialog } from "@/lib/hooks/use-dialog";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FileUploader } from "../file-uploader";
import { Button } from "../ui/button";

export default function UploadProfileDialog() {
  const dialog = useDialog();
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile("imageUploader", {
    defaultUploadedFiles: [],
  });

  return (
    <Dialog
      open={dialog.activeDialog === "uploadImageDialog"}
      onOpenChange={(open) => dialog.setActiveDialog(open ? "uploadImageDialog" : "")}
    >
      <DialogTrigger asChild>
        <Button variant="expandIcon" Icon={ImageUp} iconPlacement="right" size="sm">
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isUploading) {
            e.preventDefault();
          }
        }}
        isLoading={isUploading}
      >
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Drag and drop your image here or click to browse.</DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFiles={1}
          maxSize={4 * 1024 * 1024}
          progresses={progresses}
          onUpload={uploadFiles}
          disabled={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
