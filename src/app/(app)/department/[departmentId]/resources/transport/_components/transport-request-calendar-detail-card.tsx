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
import {
  AlarmCheck,
  AlarmMinus,
  Clock,
  Dot,
  ExternalLink,
  Timer,
} from "lucide-react";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface TransportRequestCalendarDetailCardProps {
  event: {
    title: string;
    resource: TransportRequestCalendar;
  };
}

export default function TransportRequestCalendarDetailCard({
  event,
}: TransportRequestCalendarDetailCardProps) {
  const dialogManager = useDialogManager();
  const { resource } = event;
  const {
    title,
    requestId,
    status,
    createdAt,
    dateAndTimeNeeded,
    actualStart,
    completedAt,
  } = resource;

  const { color, stroke, variant } = getStatusColor(status);
  return (
    <HoverCard openDelay={100} closeDelay={100} key={requestId}>
      <HoverCardTrigger asChild>
        <div className="z-[999] overflow-hidden rounded-md border p-2">
          <div className="truncate text-xs font-semibold">{title}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] cursor-auto p-4" align="start">
        <div className="space-y-2">
          <H5 className="h-auto truncate break-words font-bold">{requestId}</H5>
          <H5 className="h-auto truncate break-words font-semibold">{title}</H5>
          <div className="flex flex-wrap items-center justify-between">
            <Badge variant={variant} className="pr-3.5">
              <Dot className="mr-1 size-3" strokeWidth={stroke} color={color} />
              {textTransform(status)}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/request/${requestId}`}
                  prefetch
                  className={cn(
                    buttonVariants({ variant: "ghost2", size: "icon" })
                  )}
                  onClick={() => dialogManager.setActiveDialog(null)}
                >
                  <ExternalLink className="size-4" />{" "}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <P>View</P>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex flex-col space-y-0.5 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <Timer className="size-4" />
                <P>Date and Time Needed:</P>
              </div>
              <P>{format(new Date(dateAndTimeNeeded), "PP p")}</P>
            </div>
            <div className="flex flex-col space-y-0.5 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <Clock className="size-4" />
                <P>Requested:</P>
              </div>
              <P>Requested: {format(new Date(createdAt), "PP")}</P>
            </div>
            <div className="flex flex-col space-y-0.5 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <AlarmCheck className="size-4" />
                <P>Actual Start Time: </P>
              </div>
              <P>{actualStart ? format(new Date(actualStart), "PP p") : "-"}</P>
            </div>
            <div className="flex flex-col space-y-0.5 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <AlarmMinus className="size-4" />
                <P>Actual End Time: </P>
              </div>
              <P>{completedAt ? format(new Date(completedAt), "PP p") : "-"}</P>
            </div>
            {/* <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Timer className="size-4" />
                <P>Estimated time: {estimatedTime} hours</P>
              </div> */}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
