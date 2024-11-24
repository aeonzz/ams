"use client";

import React from "react";
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
import { TransportRequestCalendar } from "./types";
import { H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Clock, Dot, ExternalLink } from "lucide-react";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";

interface TransportRequestCalendarDetailCardProps {
  event: {
    title: string;
    resource: TransportRequestCalendar;
  };
}

export default function TransportRequestCalendarDetailCard({
  event,
}: TransportRequestCalendarDetailCardProps) {
  const { resource } = event;
  const { title, requestId, status, createdAt } = resource;

  const { color, stroke, variant } = getStatusColor(status);
  return (
    <HoverCard openDelay={100} closeDelay={100} key={requestId}>
      <HoverCardTrigger asChild>
        <div className="z-[999] overflow-hidden rounded-md border p-2">
          <div className="truncate text-xs font-semibold">{title}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 cursor-auto p-4" align="start">
        <div className="space-y-2">
          <H5 className="h-auto truncate break-words font-bold">{requestId}</H5>
          <H5 className="h-auto truncate break-words font-semibold">{title}</H5>
          <div className="flex flex-wrap gap-2">
            <Badge variant={variant} className="pr-3.5">
              <Dot className="mr-1 size-3" strokeWidth={stroke} color={color} />
              {textTransform(status)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <P>Created: {format(new Date(createdAt), "PP")}</P>
              </div>
              {/* <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Timer className="size-4" />
                <P>Estimated time: {estimatedTime} hours</P>
              </div> */}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/request/${requestId}`}
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
