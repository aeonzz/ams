"use client";

import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { P } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRequestById } from "@/lib/actions/requests";
import { useServerActionQuery } from "@/lib/hooks/server-action-hooks";
import React from "react";
import JobRequest from "./job-request";

interface MyRequestScreenParamsProps {
  params: string;
}

export default function MyRequestScreenParams({
  params,
}: MyRequestScreenParamsProps) {
  const { data, isLoading, isError, refetch } = useServerActionQuery(
    getRequestById,
    {
      input: {
        id: params,
      },
      queryKey: ["get-request-by-id"],
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <FetchDataError refetch={refetch} />;
  }

  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-semibold">{data.title}</P>
        </div>
        <ScrollArea className="h-full py-3">
          {data.type === "JOB" && (
            <JobRequest data={data} />
          )}
        </ScrollArea>
      </div> 
    </div>
  );
}
