import { Skeleton } from "@/components/ui/skeleton"

export default function DepartmentBorrowableItemsSkeleton() {
  return (
    <div className="grid w-full grid-cols-3 gap-3 pb-3" aria-busy="true" aria-label="Loading items">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="flex h-auto w-full justify-between gap-3 overflow-hidden rounded-md p-3"
        >
          <Skeleton className="aspect-square h-24 w-24 rounded-md" />
          <div className="flex h-full w-full flex-col justify-between overflow-hidden">
            <div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="mt-auto flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}