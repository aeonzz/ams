"use client";

import { H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  formatFullName,
  getChangeTypeInfo,
  textTransform,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, Dot, FileText, User } from "lucide-react";
import Image from "next/image";
import {
  GenericAuditLog,
  type JobRequestWithRelations,
} from "prisma/generated/zod";
import React from "react";

interface JobRequestDetailsProps {
  data: JobRequestWithRelations;
}

export default function JobRequestDetails({ data }: JobRequestDetailsProps) {
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
          Job Request Details
        </H4>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <P>Job Type: {textTransform(data.jobType)}</P>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <P>
            Assigned To:{" "}
            {data.assignedUser
              ? formatFullName(
                  data.assignedUser.firstName,
                  data.assignedUser.middleName,
                  data.assignedUser.lastName
                )
              : "N/A"}
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <P>Due Date: {format(new Date(data.dueDate), "PPP p")}</P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">
            Job Description:
          </H5>
          <P className="text-wrap break-all">{data.description}</P>
        </div>
        <div>
          {data.files.map((file) => (
            <div key={file.id} className="relative mb-3 w-full">
              <Image
                src={file.url}
                alt={`Image of ${file.url}`}
                placeholder="empty"
                quality={100}
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full rounded-sm border object-contain"
              />
            </div>
          ))}
        </div>
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
                <div key={activity.id} className="flex items-center space-x-2">
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
    </>
  );
}
