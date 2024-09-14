import React from "react";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssignUserFormSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] flex-col gap-4 overflow-y-auto px-4 py-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Separator className="my-4" />
      <DialogFooter>
        <div></div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </DialogFooter>
    </>
  );
}
