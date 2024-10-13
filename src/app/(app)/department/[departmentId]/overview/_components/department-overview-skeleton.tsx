import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DepartmentOverviewSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        <div className="container w-full p-0">
          <div className="grid grid-flow-row grid-cols-2 gap-3">
            <div className="col-span-2 flex h-[430px] rounded-md border">
              <div className="w-[40%] border-r">
                <div className="flex h-[50px] items-center justify-between border-b px-3">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-2 p-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex h-[50px] items-center justify-between border-b px-3">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
                <div className="space-y-4 p-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <div className="flex h-fit gap-2">
                <Card className="flex-1 bg-secondary">
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
                <Card className="flex-1 bg-secondary">
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-secondary">
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
