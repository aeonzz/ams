import React from "react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobRequestInputSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
        <div className="flex flex-1 flex-col space-y-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2 py-1">
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-10 w-[230px]" />
            </div>
          </div>
          <div className="rounded-md border p-3">
            <Skeleton className="mb-2 h-[72px] w-full" />
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <DialogFooter>
        <Skeleton className="ml-auto h-10 w-28" />
      </DialogFooter>
    </>
  );
}
