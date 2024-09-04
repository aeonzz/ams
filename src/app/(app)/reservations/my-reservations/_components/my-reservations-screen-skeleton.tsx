import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MyReservationsScreenSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="scroll-bar flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            {["all", "venue", "transport", "returnable"].map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {[1, 2, 3].map((index) => (
              <SkeletonCard key={index} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="bg-secondary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
