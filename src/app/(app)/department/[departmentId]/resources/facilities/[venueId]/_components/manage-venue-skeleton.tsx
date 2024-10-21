"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { H5 } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";

export default function ManageVenueSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          <Skeleton className="size-7" />
          <H5 className="truncate font-semibold">
            <Skeleton className="h-6 w-40" />
          </H5>
        </div>
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="scroll-bar container flex h-full overflow-y-auto p-0">
        <div className="flex flex-col gap-3 p-6 pr-0">
          <Skeleton className="aspect-video h-64 w-[380px]" />
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-3">
              <div className="space-y-1">
                <Skeleton className="h-9 w-[380px]" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
            <div className="w-full space-y-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Separator orientation="vertical" className="mx-6 h-full" />
        <div className="flex-1">
          <VenueRequestsTableSkeleton />
        </div>
      </div>
    </div>
  );
}

function VenueRequestsTableSkeleton() {
  return (
    <div className="m-6 ml-0 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="scroll-bar h-[72vh] overflow-y-auto">
        <div className="space-y-2 border p-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-48" />
      </div>
    </div>
  );
}
