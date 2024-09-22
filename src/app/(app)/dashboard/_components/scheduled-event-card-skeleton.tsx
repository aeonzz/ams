import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduledEventCardSkeleton() {
  return (
    <Card className="mb-2 bg-secondary">
      <CardHeader>
        <div className="relative aspect-video h-20">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 rounded-sm border p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1 truncate">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-24" />
          </span>
          <span className="space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-24" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
