"use client";

import React, { useCallback, useState } from "react";
import { ImageUp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "../file-uploader";
import { updateUser } from "@/lib/actions/users";
import { toast } from "sonner";

export default function UploadProfileDialog() {
  const [open, setOpen] = React.useState(false);
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  const handleUpload = useCallback(
    async (files: File[]) => {
      try {
        const results = await uploadFiles(files);
        await updateUser({
          profileUrl: results[0].filePath,
          path: "/settings/account",
        });
        setOpen(false);
      } catch (error) {
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload image, please try again later.",
        });
      }
    },
    [uploadFiles]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent
        onInteractOutside={(e) => {
          if (isUploading) {
            e.preventDefault();
          }
        }}
        isLoading={isUploading}
      >
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Drag and drop your avatar here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <div className="p-3 pt-0">
          <FileUploader
            maxFiles={1}
            maxSize={8 * 1024 * 1024}
            onUpload={handleUpload}
            progresses={progresses}
            disabled={isUploading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
