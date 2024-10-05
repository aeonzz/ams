"use client";

import React from "react";

import {
  type TransportRequestWithRelations,
  type GenericAuditLog,
} from "prisma/generated/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { H4, H5, P } from "@/components/typography/text";
import { Calendar, Dot, MapPin, Users, UsersRound } from "lucide-react";
import { format } from "date-fns";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getChangeTypeInfo,
  getVehicleStatusColor,
  textTransform,
} from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransportRequestDetailsProps {
  data: TransportRequestWithRelations;
  requestId: string;
  cancellationReason: string | null;
}

export default function TransportRequestDetails({
  data,
  requestId,
  cancellationReason,
}: TransportRequestDetailsProps) {
  const { variant, color, stroke } = getVehicleStatusColor(data.vehicle.status);
  const { data: logs, isLoading } = useQuery<GenericAuditLog[]>({
    queryFn: async () => {
      const res = await axios.get(`/api/audit-log/request-log/${requestId}`);
      return res.data.data;
    },
    queryKey: ["activity", requestId],
  });
  return (
    <>
      <div className="space-y-4">
        <div className="flex h-7 items-center justify-between">
          <H4 className="font-semibold text-muted-foreground">
            Transport Request Details
          </H4>
          {data.inProgress && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex animate-pulse cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-tertiary">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <P className="font-semibold text-blue-500 leading-none">In Progress</P>
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-3" side="bottom">
                Transport is in progress
              </TooltipContent>
            </Tooltip>
          )}
          {/* <div className="space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost2"
                  size="icon"
                  className="size-7"
                  onClick={handleDownloadEvaluation}
                >
                  <Download className="size-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-3" side="bottom">
                <CommandTooltip text="Download job request form">
                  <CommandShortcut>Ctrl</CommandShortcut>
                  <CommandShortcut>Shift</CommandShortcut>
                  <CommandShortcut>D</CommandShortcut>
                </CommandTooltip>
              </TooltipContent>
            </Tooltip>
            {isEvaluated && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="icon"
                    className="size-7"
                    onClick={handleDownloadEvaluation}
                  >
                    <FileCheck className="size-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="flex items-center gap-3"
                  side="bottom"
                >
                  <CommandTooltip text="Download evaluation form">
                    <CommandShortcut>Ctrl</CommandShortcut>
                    <CommandShortcut>Shift</CommandShortcut>
                    <CommandShortcut>E</CommandShortcut>
                  </CommandTooltip>
                </TooltipContent>
              </Tooltip>
            )}
          </div> */}
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Vehicle:</H5>
          <Card>
            <CardHeader className="p-3">
              <div className="flex w-full space-x-3">
                <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={data.vehicle.imageUrl}
                    alt={`Image of ${data.vehicle.name}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <div className="space-y-1 truncate">
                    <P className="truncate font-semibold">
                      {data.vehicle.name}
                    </P>
                    <P className="text-xs text-muted-foreground">
                      {data.vehicle.type}
                    </P>
                    <Badge variant={variant} className="pr-3.5">
                      <Dot
                        className="mr-1 size-3"
                        strokeWidth={stroke}
                        color={color}
                      />
                      {textTransform(data.vehicle.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <P>Destination: {data.destination}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <P>Office/Dept.: {data.department}</P>
        </div>
        <div className="flex h-fit space-x-2">
          <div className="h-full">
            <UsersRound className="h-5 w-5" />
          </div>
          <P>Passengers: {data.passengersName.join(", ")}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <P>
            Date of Travel: {format(new Date(data.dateAndTimeNeeded), "PPP p")}
          </P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Purpose:</H5>
          <P className="text-wrap break-all">{data.description}</P>
        </div>
        {cancellationReason && (
          <Card>
            <CardHeader>
              <H5 className="font-semibold leading-none">
                Cancellation Reason
              </H5>
              <CardDescription>{cancellationReason}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
      <Separator className="my-6" />
      <div className="space-y-4 pb-20">
        <H4 className="font-semibold">Activity</H4>
        {isLoading ? (
          <>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            {logs?.map((activity) => {
              const {
                color,
                icon: Icon,
                message,
              } = getChangeTypeInfo(activity.changeType);
              return (
                <div key={activity.id} className="flex items-center space-x-2">
                  <Icon className="size-5" color={color} />
                  <P className="inline-flex items-center text-muted-foreground">
                    {message}
                    <Dot /> {format(new Date(activity.timestamp), "MMM d")}
                  </P>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
