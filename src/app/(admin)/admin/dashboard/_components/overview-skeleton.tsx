import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export default function OverviewSkeleton() {
  return (
    <div className="grid h-fit grid-flow-row grid-cols-4 gap-3">
      {/* KPI Cards */}
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[100px]" />
            <Skeleton className="mt-1 h-4 w-[200px]" />
          </CardContent>
        </Card>
      ))}

      {/* Request Chart */}
      <Card className="col-span-4 h-[400px] bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="mt-1 h-4 w-[250px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>

      {/* Requests Table */}
      <Card className="col-span-4 bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-[150px]" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="mt-2 h-12 w-full" />
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
