"use client";

import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import { P } from "@/components/typography/text";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { UserJobReportData } from "./types";
import UserDetails from "./user-details";
import { Separator } from "@/components/ui/separator";
import ReportOverView from "./report-overview";

interface UserJobReportScreenProps {
  userId: string;
}

export default function UserJobReportScreen({
  userId,
}: UserJobReportScreenProps) {
  const { data, isLoading, refetch, isError, error } = useQuery<
    UserJobReportData,
    Error
  >({
    queryFn: async () => {
      const res = await axios.get(`/api/reports/user-job-report/${userId}`);
      return res.data.data;
    },
    queryKey: ["user-job-report", userId],
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">My Job Requests</P>
        <SearchInput />
      </div>
      <div className="scroll-bar container flex flex-1 justify-center overflow-y-auto p-0">
        {isLoading ? (
          <h1>...isLoading</h1>
        ) : isError || !data ? (
          <div className="flex h-screen w-full items-center justify-center">
            {axios.isAxiosError(error) && error.response?.status === 404 ? (
              <FetchDataError refetch={refetch} />
            ) : (
              <FetchDataError refetch={refetch} />
            )}
          </div>
        ) : (
          <div className="h-fit w-full">
            <UserDetails user={data.user} />
            <Separator className="my-2" />
            <ReportOverView data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
