"use client";

import React from "react";
import { H1, H3, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { type RequestWithRelations } from "prisma/generated/zod";
import { Card } from "@/components/ui/card";

interface JobRequestProps {
  data: RequestWithRelations;
}

export default function JobRequest({ data }: JobRequestProps) {
  return (
    <div className="flex items-center justify-center py-5">
      <div className="flex w-[720px] flex-col gap-3">
        <H1 className="font-semibold">{data.title}</H1>
        <div>
          <P className="text-muted-foreground">Description:</P>
          <H5>{data.notes}</H5>
        </div>
        <div className="mx-auto w-full max-w-7xl space-y-8">
          {data.jobRequest?.files.map((file, index) => (
            <Card
              key={index}
              className="flex w-full justify-center overflow-hidden"
            >
              <Image
                src={file.url}
                alt={`Image ${index + 1}`}
                width={1280}
                height={960}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="h-auto w-full object-contain"
              />
            </Card>
          ))}
        </div>
        <Separator className="my-6" />
      </div>
    </div>
  );
}
