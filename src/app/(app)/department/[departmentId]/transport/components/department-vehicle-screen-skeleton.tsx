import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleLoadingSkeleton() {
  return (
    <div className="w-[1280px]">
      <div className="mb-3 h-9 w-[280px] bg-tertiary rounded-md"></div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border shadow-sm"
          >
            <Skeleton className="h-48 w-full" />
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            {/* <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent> */}
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </div>
        ))}
      </div>
    </div>
  );
}
