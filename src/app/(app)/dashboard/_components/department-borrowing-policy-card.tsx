"use client";

import {
  Clock,
  Ban,
  HourglassIcon,
  FileText,
  CalendarClock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DepartmentWithRelations } from "prisma/generated/zod";

interface DepartmentBorrowingPolicyCardProps {
  data: DepartmentWithRelations | undefined;
}

export default function DepartmentBorrowingPolicyCard({
  data,
}: DepartmentBorrowingPolicyCardProps) {
  if (!data) return null;

  // const { departmentBorrowingPolicy: policy } = data;
  // if (!policy) return null;
  // const formatDuration = (duration: number) => {
  //   if (duration < 24) {
  //     return `${duration} hour${duration !== 1 ? "s" : ""}`;
  //   } else {
  //     const days = Math.floor(duration / 24);
  //     return `${days} day${days !== 1 ? "s" : ""}`;
  //   }
  // };

  return (
    <></>
    // <Card className="w-full max-w-2xl bg-secondary">
    //   <CardHeader>
    //     <CardTitle>Department Borrowing Policy</CardTitle>
    //     <CardDescription></CardDescription>
    //   </CardHeader>
    //   <CardContent className="grid gap-4">
    //     <div className="grid grid-cols-2 items-center gap-4">
    //       <div className="flex items-center space-x-2">
    //         <Ban className="h-4 w-4 text-muted-foreground" />
    //         <span className="text-sm font-medium">Penalty Ban Duration:</span>
    //       </div>
    //       <span className="text-sm">
    //         {policy.penaltyBorrowBanDuration
    //           ? formatDuration(policy.penaltyBorrowBanDuration)
    //           : "N/A"}
    //       </span>

    //       <div className="flex items-center space-x-2">
    //         <HourglassIcon className="h-4 w-4 text-muted-foreground" />
    //         <span className="text-sm font-medium">Grace Period:</span>
    //       </div>
    //       <span className="text-sm">{formatDuration(policy.gracePeriod)}</span>
    //     </div>
    //     <div className="space-y-2">
    //       <div className="flex items-center space-x-2">
    //         <FileText className="h-4 w-4 text-muted-foreground" />
    //         <span className="text-sm font-medium">Other Information:</span>
    //       </div>
    //       <div className="w-[calc(100%_-_24px) ml-6">
    //         <span className="break-all text-sm">{policy.other || "N/A"}</span>
    //       </div>
    //     </div>

    //     <div className="flex justify-between text-xs text-muted-foreground">
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger
    //             className="flex items-center space-x-1"
    //             onClick={(e) => e.preventDefault()}
    //           >
    //             <CalendarClock className="h-3 w-3" />
    //             <span>Created</span>
    //           </TooltipTrigger>
    //           <TooltipContent>
    //             <p>{policy.createdAt.toLocaleString()}</p>
    //           </TooltipContent>
    //         </Tooltip>
    //       </TooltipProvider>
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger
    //             className="flex items-center space-x-1"
    //             onClick={(e) => e.preventDefault()}
    //           >
    //             <CalendarClock className="h-3 w-3" />
    //             <span>Updated</span>
    //           </TooltipTrigger>
    //           <TooltipContent>
    //             <p>{policy.updatedAt.toLocaleString()}</p>
    //           </TooltipContent>
    //         </Tooltip>
    //       </TooltipProvider>
    //     </div>
    //   </CardContent>
    // </Card>
  );
}
