import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MyJobRequestsSkeleton() {
  return (
    <div className="h-fit w-full space-y-4">
      {/* Calendar Skeleton */}
      <div className="rounded-lg p-4">
        <div className="mb-4 flex w-full justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg p-4">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-9 w-1/4" />
              <Skeleton className="h-9 w-1/4" />
              <Skeleton className="h-9 w-1/6" />
              <Skeleton className="h-9 w-1/6" />
              <Skeleton className="h-9 w-1/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
