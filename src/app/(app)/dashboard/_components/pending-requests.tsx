"use client";

import FetchDataError from "@/components/card/fetch-data-error";
import NoData from "@/components/card/no-data";
import PendingReqCard from "@/components/card/pending-req-card";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { getPendingReq } from "@/lib/actions/requests";
import { useServerActionQuery } from "@/lib/hooks/server-action-hooks";
import React from "react";

export default function PendingRequest() {
  const { isLoading, data, isError, refetch } = useServerActionQuery(
    getPendingReq,
    {
      input: {},
      queryKey: ["pending-req"],
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="flex min-h-60 flex-col items-center justify-center space-y-2 pb-10">
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <FetchDataError refetch={refetch} />
      ) : data?.length === 0 ? (
        <NoData message="All of your requests will show up here" />
      ) : (
        <>
          {data?.map((req, index) => <PendingReqCard key={index} data={req} />)}
        </>
      )}
    </div>
  );
}
