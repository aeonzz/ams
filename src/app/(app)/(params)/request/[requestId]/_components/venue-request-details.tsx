"use client";

import { H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getChangeTypeInfo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Clock, Dot, MapPin } from "lucide-react";
import {
  GenericAuditLog,
  VenueRequestWithRelations,
} from "prisma/generated/zod";
import React from "react";

interface VenueRequestDetailsProps {
  data: VenueRequestWithRelations;
}

export default function VenueRequestDetails({
  data,
}: VenueRequestDetailsProps) {
  const { data: logs, isLoading } = useQuery<GenericAuditLog[]>({
    queryFn: async () => {
      const res = await axios.get(`/api/audit-log/request-log/${data.id}`);
      return res.data.data;
    },
    queryKey: [data.id],
  });
  return (
    <>
      <div className="space-y-4">
        <H4 className="font-semibold text-muted-foreground">
          Venue Request Details
        </H4>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <P>Venue: {data.venue.name}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>Start: {format(new Date(data.startTime), "PPP p")}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>End: {format(new Date(data.endTime), "PPP p")}</P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">
            Setup Requirements:
          </H5>
          <ul className="ml-4 mt-2 list-disc">
            {data.setupRequirements.split(", ").map((requirement, index) => (
              <li key={index} className="mb-1 text-sm">
                {requirement}
              </li>
            ))}
          </ul>
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
                  <div
                    key={activity.id}
                    className="flex items-center space-x-2"
                  >
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
      </div>
    </>
  );
}
