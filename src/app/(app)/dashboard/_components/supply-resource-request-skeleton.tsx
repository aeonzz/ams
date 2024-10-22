import { Skeleton } from "@/components/ui/skeleton";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function SupplyResourceRequestSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
        <div className="flex w-full flex-col space-y-4">
          {/* SupplyItemsField skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* DateTimePicker skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Purpose checkboxes skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Other Purpose input skeleton (conditionally rendered in actual component) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <DialogFooter>
        <Skeleton className="ml-auto h-10 w-28" />
      </DialogFooter>
    </>
  );
}
