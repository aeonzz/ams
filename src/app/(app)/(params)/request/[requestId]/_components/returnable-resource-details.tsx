"use client";

import { H4, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  formatFullName,
  getChangeTypeInfo,
  getReturnableItemStatusIcon,
  textTransform,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, Dot, FileText, User } from "lucide-react";
import Image from "next/image";
import type {
  GenericAuditLog,
  ReturnableRequestWithRelations,
} from "prisma/generated/zod";
import React from "react";

interface ReturnableResourceDetailsProps {
  data: ReturnableRequestWithRelations;
}

export default function ReturnableResourceDetails({
  data,
}: ReturnableResourceDetailsProps) {
  const { icon: Icon, variant } = getReturnableItemStatusIcon(data.item.status);
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
          Supply Request Details
        </H4>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <P className="underline underline-offset-4">
            Needed By: {format(new Date(data.dateAndTimeNeeded), "PPP p")}
          </P>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <P className="underline underline-offset-4">
            Return By: {format(new Date(data.returnDateAndTime), "PPP p")}
          </P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Item:</H5>
          <Card>
            <CardHeader className="p-3">
              <div className="flex w-full space-x-3">
                <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={data.item.imageUrl}
                    alt={`Image of ${data.item.subName}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <div className="space-y-1 truncate">
                    <P className="truncate font-semibold">
                      {data.item.inventory.name} - {data.item.subName}
                    </P>
                    <P className="text-xs text-muted-foreground">
                      {data.item.serialNumber}
                    </P>
                    <Badge variant={variant} className="ml-auto">
                      <Icon className="mr-1 size-4" />
                      {textTransform(data.item.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Purpose:</H5>
          <P>{data.purpose}</P>
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
