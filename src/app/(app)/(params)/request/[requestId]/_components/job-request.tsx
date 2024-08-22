"use client";

import { H1, H3, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusIcon,
} from "@/lib/utils";
import { Request } from "prisma/generated/zod";
import React from "react";

interface JobRequestProps {
  data: Request;
}

export default function JobRequest({ data }: JobRequestProps) {
  const PrioIcon = getPriorityIcon(data.priority);
  const StatusIcon = getStatusIcon(data.status);
  const RequestTypeIcon = getRequestTypeIcon(data.type);
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-[60vw] flex-col gap-3 py-10">
        <div>
          <H5>Request details</H5>
          <H1 className="font-bold">{data.title}</H1>
        </div>
        <div className="flex space-x-3">
          <Badge className="gap-2">
            <PrioIcon />
            {data.priority}
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <StatusIcon />
            {data.status}
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <RequestTypeIcon />
            {data.type} request
          </Badge>
        </div>
        <H5>{data.notes}</H5>
        <Separator className="my-6" />
      </div>
    </div>
  );
}
