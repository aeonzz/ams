import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function DashboardSkeleton() {
  const requestTypes = ["JOB", "RESOURCE", "VENUE", "TRANSPORT"]

  return (
    <div className="space-y-3">
      <div className="border-y">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-4 gap-3 p-3">
          {requestTypes.map((type) => (
            <Card key={type} className="bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-3 p-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-secondary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-4 w-48" />
                  </CardTitle>
                  <Badge variant="secondary">
                    <Skeleton className="h-4 w-20" />
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="outline">
                    <Skeleton className="h-4 w-24" />
                  </Badge>
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}