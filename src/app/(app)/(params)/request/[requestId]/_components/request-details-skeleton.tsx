import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function RequestDetailsSkeleton() {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-[50px] items-center border-b px-6">
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="scroll-bar flex h-[calc(100vh_-_75px)] justify-center overflow-y-auto px-10 py-10">
          <div className="h-auto w-[750px] space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  {index === 3 && (
                    <div className="mt-2">
                      <Skeleton className="h-20 w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-4 pb-20">
              <Skeleton className="h-6 w-1/4" />
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-[320px] space-y-6 p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}