"use client";

import { P } from "@/components/typography/text";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "@/components/card/fetch-data-error";
import ScheduleCalendar from "./schedule-calendar";
import JobRequestsTable from "./job-requests-table";
import type { JobRequestWithRelations } from "prisma/generated/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getJobStatusColor, textTransform } from "@/lib/utils";
import { BarChart, Dot } from "lucide-react";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { DepartmentJobRequestsSkeleton } from "./department-job-requests-skeleton";

interface DepartmentJobRequestsScreenProps {
  departmentId: string;
}

export default function DepartmentJobRequestsScreen({
  departmentId,
}: DepartmentJobRequestsScreenProps) {
  const { data, isLoading, refetch, isError, error } = useQuery<
    JobRequestWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(
        `/api/request/job-request/get-department-job-requests/${departmentId}`
      );
      return res.data.data;
    },
    queryKey: [departmentId],
  });

  if (isLoading) {
    return <DepartmentJobRequestsSkeleton />;
  }

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const formattedData = data.map((request) => ({
    id: request.requestId,
    title: request.request.title,
    department: request.request.department.name,
    dueDate: request.dueDate,
    jobStatus: request.status,
    estimatedTime: request.estimatedTime,
  }));

  const activeJobs = formattedData.filter(
    (job) => job.jobStatus === "IN_PROGRESS"
  );

  return (
    <div className="h-fit w-full border rounded-md">
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
                  <Link key={job.id} href={`/request/${job.id}`}>
                    <Card
                      key={job.id}
                      className="transition-colors hover:bg-secondary-accent"
                    >
                      <CardHeader className="p-3 pt-2">
                        <P className="truncate text-sm font-medium">
                          {job.title}
                        </P>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={variant} className="w-fit pr-3.5">
                            <Dot
                              className="mr-1 size-3"
                              strokeWidth={stroke}
                              color={color}
                            />
                            {textTransform(job.jobStatus)}
                          </Badge>
                          <Badge variant="outline">{job.department}</Badge>
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
  );
}
