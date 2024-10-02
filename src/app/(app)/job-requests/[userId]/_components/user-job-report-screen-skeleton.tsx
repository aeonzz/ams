import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function UserJobReportScreenSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="scroll-bar container flex flex-1 justify-center overflow-y-auto p-0">
        <div className="h-fit w-full">
          <div className="p-3">
            <div className="flex gap-3">
              <Skeleton className="size-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-40" />
                <div className="flex space-x-1 mt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-3 p-3">
            <div className="flex gap-3">
              <Skeleton className="h-64 w-1/2" />
              <Skeleton className="h-64 w-1/2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array(6).fill(0).map((_, index) => (
                      <TableHead key={index}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5).fill(0).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}