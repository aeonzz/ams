"use client";

import React, { useCallback, useState } from "react";

import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { showErrorToast } from "@/lib/handle-errror";

export default function UploadAttachment() {
  const { uploadFiles, progresses, isUploading, uploadedFiles } = useUploadFile();

  const handleUpload = useCallback(
    async (files: File[]) => {
      try {
        const results = await uploadFiles(files);
      } catch (error) {
        showErrorToast(error);
      }
    },
    [uploadFiles]
  );

  return (
    <FileUploader
      maxFiles={2}
      maxSize={4 * 1024 * 1024}
      onUpload={handleUpload}
      progresses={progresses}
      disabled={isUploading}
      drop={false}
    />
  );
}
