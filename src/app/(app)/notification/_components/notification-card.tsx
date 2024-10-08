"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notification } from "prisma/generated/zod";
import { format, formatDistanceToNow } from "date-fns";
import { P } from "@/components/typography/text";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  data: Notification;
  onClick: () => void;
  isSelected: boolean;
}

export default function NotificationCard({
  data,
  onClick,
  isSelected,
}: NotificationCardProps) {
  return (
    <div
      className={cn(
        "mb-1 flex w-full cursor-pointer rounded-md border hover:bg-secondary-accent",
        isSelected && "border-primary bg-secondary-accent"
      )}
      onClick={onClick}
    >
      <div className="py-5 pl-3">
        {!data.isRead && <div className="size-2.5 rounded-full bg-primary" />}
      </div>
      <div className="w-[calc(100%_-_28px)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 truncate pb-1 pl-2">
          <CardTitle className="truncate">{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pl-2">
          <P className="line-clamp-2 text-sm text-muted-foreground">
            {data.message}
          </P>
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}
