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
            {data.setupRequirements.map((requirement, index) => (
              <li key={index} className="mb-1 text-sm">
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-6" />
      </div>
    </>
  );
}
