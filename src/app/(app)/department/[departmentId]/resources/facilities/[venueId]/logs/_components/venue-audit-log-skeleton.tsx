"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { H5 } from "@/components/typography/text"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search } from "lucide-react"

export default function VenueAuditLogSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost2" size="icon">
            <ChevronLeft className="size-4" />
          </Button>
          <H5 className="truncate font-semibold">Facility Logs</H5>
        </div>
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
            <Skeleton className="h-9 w-64 pl-8" />
          </div>
        </div>
        <div className="scroll-bar min-h-[calc(100vh_-_150px)] overflow-y-auto">
          <VenueAuditLogTableSkeleton />
        </div>
      </div>
    </div>
  )
}

function VenueAuditLogTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex items-center justify-between px-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
      <div className="flex items-center justify-between px-4 pt-4">
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  )
}