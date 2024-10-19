import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

export default function DepartmentInsightsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-[300px] justify-start text-left" disabled>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-[100px]" />
          </Button>
        </div>
      </div>
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
        
        {/* Request Status Overview */}
        <Card className="col-span-1 h-[400px] bg-secondary">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
          <CardFooter className="flex-col items-center">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="mt-2 h-4 w-[200px]" />
          </CardFooter>
        </Card>
        
        {/* Request Chart */}
        <Card className="col-span-3 h-[400px] bg-secondary">
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
    </div>
  )
}