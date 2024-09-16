import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";

export default function VenueRequestInputSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
        <div className="flex w-[307px] flex-col space-y-2">
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
        <div className="flex flex-1 flex-col space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
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
