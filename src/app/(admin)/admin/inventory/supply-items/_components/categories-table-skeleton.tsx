import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, PlusIcon } from "lucide-react";

export default function CategoriesTableSkeleton() {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex space-x-3">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="scroll-bar overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-transparent px-5">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="bg-transparent px-5">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="bg-transparent px-5">
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
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
      </div>
      <div className="px-4 py-2">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
