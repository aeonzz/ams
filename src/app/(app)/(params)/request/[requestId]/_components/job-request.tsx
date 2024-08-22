"use client";

import { H1, H3, H5, P } from "@/components/typography/text";
import { Request } from "prisma/generated/zod";
import React from "react";

interface JobRequestProps {
  data: Request;
}

export default function JobRequest({ data }: JobRequestProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[60vw] space-y-3 p-10">
        <div>
          <H5>Request details</H5>
          <H1 className="font-semibold">{data.title}</H1>
        </div>
        <H5 className="text-muted-foreground">{data.notes}</H5>
      </div>
    </div>
  );
}
