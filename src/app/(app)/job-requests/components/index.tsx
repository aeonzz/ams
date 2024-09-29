"use client";

import { P } from "@/components/typography/text";
import React from "react";
import SearchInput from "../../_components/search-input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "@/lib/hooks/use-session";
import FetchDataError from "@/components/card/fetch-data-error";
import ScheduleCalendar from "./schedule-calendar";
import JobRequestsTable from "./job-requests-table";
import type { JobRequestsTableType } from "./type";
import type { JobRequestWithRelations } from "prisma/generated/zod";

interface MyJobRequestsScreenProps {}

export default function MyJobRequestsScreen({}: MyJobRequestsScreenProps) {
  const currentUser = useSession();

  const { data, isLoading, refetch, isError } = useQuery<
    JobRequestWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(
        `/api/request/job-request/get-my-job-requests/${currentUser.id}`
      );
      return res.data.data;
    },
    queryKey: [currentUser.id],
  });

  let formattedData: JobRequestsTableType[] = [];

  if (!isLoading && !isError && data) {
    formattedData = data.map((request) => ({
      id: request.requestId,
      title: request.request.title,
      department: request.request.department.name,
      dueDate: request.dueDate,
      jobStatus: request.status,
      estimatedTime: request.estimatedTime,
    }));
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">My Job Requests</P>
        <SearchInput />
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : isError || !data ? (
          <div className="flex h-screen w-full items-center justify-center">
            <FetchDataError refetch={refetch} />
          </div>
        ) : (
          <div className="w-full">
            <ScheduleCalendar />
            <JobRequestsTable data={formattedData} />
          </div>
        )}
      </div>
    </div>
  );
}
