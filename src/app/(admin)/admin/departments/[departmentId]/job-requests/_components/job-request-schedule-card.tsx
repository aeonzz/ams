import React from "react";
import { Badge } from "@/components/ui/badge";
import { JobRequestsTableType } from "./type";
import { cn, getJobStatusColor, textTransform } from "@/lib/utils";
import { Dot, Clock, ExternalLink, Timer } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H3, H5, P } from "@/components/typography/text";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface JobRequestScheduleCardProps {
  event: {
    title: string;
    resource: JobRequestsTableType;
  };
}

export function JobRequestScheduleCard({ event }: JobRequestScheduleCardProps) {
  const { title, resource } = event;
  const { jobStatus, department, dueDate, estimatedTime, id } = resource;

  const { color, stroke, variant } = getJobStatusColor(jobStatus);

  return (
    <HoverCard openDelay={100} closeDelay={100} key={id}>
      <HoverCardTrigger asChild>
        <div className="z-[999] overflow-hidden rounded-md border p-2">
          <div className="truncate text-xs font-semibold">{title}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 cursor-auto p-4" align="start">
        <div className="space-y-2">
          <H5 className="h-auto truncate break-words font-semibold">{title}</H5>
          <div className="flex flex-wrap gap-2">
            <Badge variant={variant} className="pr-3.5">
              <Dot className="mr-1 size-3" strokeWidth={stroke} color={color} />
              {textTransform(jobStatus)}
            </Badge>
            <Badge variant="outline">{department}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <P>Due: {format(new Date(dueDate), "PP")}</P>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Timer className="size-4" />
                <P>Estimated time: {estimatedTime} hours</P>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/request/${id}`}
                    prefetch
                    className={cn(
                      buttonVariants({ variant: "ghost2", size: "icon" })
                    )}
                  >
                    <ExternalLink className="size-4" />{" "}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <P>View</P>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
