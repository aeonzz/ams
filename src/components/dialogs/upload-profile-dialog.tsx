"use client";

import React, { useCallback, useState } from "react";
import { ImageUp } from "lucide-react";

import { useDialog } from "@/lib/hooks/use-dialog";
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
  const dialog = useDialog();
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  const handleUpload = useCallback(
    async (files: File[]) => {
      try {
        const results = await uploadFiles(files);
        console.log(results)
        await updateUser({
          profileUrl: results[0].filePath,
          path: "/settings/account",
        });
      } catch (error) {
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not update user, please try again later.",
        });
      }
    },
    [uploadFiles]
  );

  return (
    <Dialog
      open={dialog.activeDialog === "uploadImageDialog"}
      onOpenChange={(open) =>
        dialog.setActiveDialog(open ? "uploadImageDialog" : "")
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
          <DialogDescription>
            Drag and drop your image here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFiles={2}
          maxSize={4 * 1024 * 1024}
          onUpload={handleUpload}
          progresses={progresses}
          disabled={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
