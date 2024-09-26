import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";

export default function TransportRequestInputSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
        <div className="flex w-full flex-col space-y-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <DialogFooter>
        <Skeleton className="ml-auto h-10 w-28" />
      </DialogFooter>
    </>
  );
}
