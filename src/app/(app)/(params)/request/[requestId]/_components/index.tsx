"use client";

import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, H4, H5, P } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRequestById } from "@/lib/actions/requests";
import { useServerActionQuery } from "@/lib/hooks/server-action-hooks";
import React from "react";
import JobRequest from "./job-request";
import { Separator } from "@/components/ui/separator";
import {
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusIcon,
  textTransform,
} from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";
import RequestActions from "./request-actions";
import { Badge } from "@/components/ui/badge";

interface MyRequestScreenParamsProps {
  params: string;
}

export default function MyRequestScreenParams({
  params,
}: MyRequestScreenParamsProps) {
  const { data, isLoading, isError, refetch } =
    useServerActionQuery(getRequestById, {
      input: {
        id: params,
      },
      queryKey: [params],
    });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <FetchDataError refetch={refetch} />;
  }

  if (!data) {
    return <NotFound />;
  }

  const PrioIcon = getPriorityIcon(data.priority);
  const statusIcon = getStatusIcon(data.status);
  const requestTypeIcon = getRequestTypeIcon(data.type);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-semibold">{data.title}</P>
        </div>
        <ScrollArea className="h-[calc(100vh_-_70px)]">
          {data.type === "JOB" && <JobRequest data={data} />}
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-[320px] space-y-3">
        <div className="flex items-center justify-between px-6 py-2">
          <H5 className="font-semibold">Details</H5>
        </div>
        <div className="flex flex-col space-y-6 px-6">
          <div className="space-y-1">
            <P className="text-muted-foreground">Request type</P>
            <Badge className="gap-2" variant={requestTypeIcon.variant}>
              <requestTypeIcon.icon className="size-5" />
              <H5 className="font-semibold">{textTransform(data.type)}</H5>
            </Badge>
          </div>
          <div className="space-y-1">
            <P className="text-muted-foreground">Request Status</P>
            <span className="flex items-center gap-3">
              <statusIcon.icon className="size-5" />
              <H5 className="font-semibold">{textTransform(data.status)}</H5>
            </span>
          </div>
          <div className="space-y-1">
            <P className="text-muted-foreground">Priority</P>
            <span className="flex items-center gap-3">
              <PrioIcon className="size-5" />
              <H5 className="font-semibold">{textTransform(data.priority)}</H5>
            </span>
          </div>
          <Separator />
          <div className="space-y-1">
            <P className="text-muted-foreground">Assigned to</P>
            <span className="flex items-center gap-3">
              <User className="size-5" />
              <H5 className="font-semibold">{data.jobRequest?.assignTo}</H5>
            </span>
          </div>
          <Separator />
          <div className="space-y-1">
            <P className="text-muted-foreground">Due date</P>
            <span className="flex items-center gap-3">
              <Calendar className="size-5" />
              {/* <H5 className="font-semibold">{format(data.jobRequest?.dueDate, "PPP")}</H5> */}
            </span>
          </div>
          <Separator />
          <RequestActions
            data={data}
            params={params}
          />
        </div>
      </div>
    </div>
  );
}
