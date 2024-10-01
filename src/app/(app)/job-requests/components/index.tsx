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
import { Separator } from "@/components/ui/separator";
import { MyJobRequestsSkeleton } from "./my-job-requests-screen-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getJobStatusColor, textTransform } from "@/lib/utils";
import { BarChart, Dot } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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

  const activeJobs = formattedData.filter(
    (job) => job.jobStatus === "IN_PROGRESS"
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">My Job Requests</P>
        <div className="flex items-center gap-2">
          <div className="flex">
            <Link
              href=""
              className={cn(
                buttonVariants({ variant: "ghost2", size: "sm" }),
                "px-3 text-xs"
              )}
            >
              Requests
            </Link>
            <Link
              href={`/job-requests/${currentUser.id}`}
              className={cn(
                buttonVariants({ variant: "ghost2", size: "sm" }),
                "px-3 text-xs"
              )}
            >
              Reports
            </Link>
          </div>
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto">
        {isLoading ? (
          <MyJobRequestsSkeleton />
        ) : isError || !data ? (
          <div className="flex h-screen w-full items-center justify-center">
            <FetchDataError refetch={refetch} />
          </div>
        ) : (
          <div className="h-fit w-full">
            <div className="flex w-full flex-col">
              <ScheduleCalendar data={formattedData} />
              {activeJobs.length > 0 && (
                <div className="w-full space-y-2">
                  <P className="p-3 pb-0 font-semibold">Active Jobs</P>
                  <div className="grid grid-cols-3 gap-3 px-3">
                    {activeJobs.map((job) => {
                      const { color, stroke, variant } = getJobStatusColor(
                        job.jobStatus
                      );
                      return (
                        <Link href={`/request/${job.id}`}>
                          <Card
                            key={job.id}
                            className="transition-colors hover:bg-secondary-accent"
                          >
                            <CardHeader className="p-3 pt-2">
                              <P className="truncate text-sm font-medium">
                                {job.title}
                              </P>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant={variant}
                                  className="w-fit pr-3.5"
                                >
                                  <Dot
                                    className="mr-1 size-3"
                                    strokeWidth={stroke}
                                    color={color}
                                  />
                                  {textTransform(job.jobStatus)}
                                </Badge>
                                <Badge variant="outline">
                                  {job.department}
                                </Badge>
                              </div>
                            </CardHeader>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <JobRequestsTable
              data={formattedData.filter(
                (request) => request.jobStatus === "PENDING"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
