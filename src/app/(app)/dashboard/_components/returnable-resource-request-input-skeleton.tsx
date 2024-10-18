import { Skeleton } from "@/components/ui/skeleton";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function ReturnableResourceRequestSkeleton() {
  return (
    <>
      <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
        <div className="flex w-full flex-col space-y-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-4 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[200px] w-full" />
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
