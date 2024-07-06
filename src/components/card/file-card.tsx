"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { formatBytes } from "@/lib/utils";

import { isFileWithPreview } from "../file-uploader";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

export default function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm break-all font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          {progress ? <Progress value={progress} className="h-1" /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
          disabled={progress !== null}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}
