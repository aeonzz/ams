"use client";

import { H4, H5, P } from "@/components/typography/text";
import { textTransform } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, FileText, User } from "lucide-react";
import Image from "next/image";
import { type JobRequestWithRelations } from "prisma/generated/zod";
import React from "react";

interface JobRequestDetailsProps {
  data: JobRequestWithRelations;
}

export default function JobRequestDetails({ data }: JobRequestDetailsProps) {
  return (
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
          Assigned To: {data.assignedUser ? data.assignedUser.username : "N/A"}
        </P>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5" />
        <P>Due Date: {format(new Date(data.dueDate), "PPP p")}</P>
      </div>
      <div>
        <H5 className="mb-2 font-semibold text-muted-foreground">Notes:</H5>
        <P>{data.description}</P>
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
  );
}
