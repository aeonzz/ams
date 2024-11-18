"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotificationWithRelations } from "prisma/generated/zod";
import { format, formatDistanceToNow } from "date-fns";
import { H4, H5, P } from "@/components/typography/text";
import { cn, textTransform } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  CircleAlert,
  Clock,
  Info,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NotificationCardProps {
  data: NotificationWithRelations;
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
        isSelected && "bg-secondary-accent"
      )}
      onClick={onClick}
    >
      <div className="flex w-auto items-center gap-1 py-4 pl-3">
        <div className="relative">
          <Avatar className="size-8 rounded-full">
            <AvatarImage src={`${data.user.profileUrl}`} />
            <AvatarFallback className="rounded-md">
              {data.user.firstName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1.5 -right-1.5 grid size-6 place-items-center rounded-full border bg-tertiary">
            {data.notificationType === "ALERT" ? (
              <AlertTriangle className="size-4 stroke-red-500" />
            ) : data.notificationType === "INFO" ? (
              <Info className="size-4 stroke-blue-500" />
            ) : data.notificationType === "REMINDER" ? (
              <Clock className="size-4 stroke-orange-500" />
            ) : data.notificationType === "SUCCESS" ? (
              <CheckCircle className="size-4 stroke-green-500" />
            ) : data.notificationType === "APPROVAL" ? (
              <ThumbsUp className="size-4 stroke-yellow-500" />
            ) : (
              <AlertCircle className="size-4 stroke-red-500" />
            )}
          </div>
        </div>
        {!data.isRead && (
          <div className="mt-1 size-2.5 animate-pulse self-start rounded-full bg-primary" />
        )}
      </div>
      <div
        className={cn(
          data.isRead ? "w-[calc(100%_-_58px)]" : "w-[calc(100%_-_48px)]"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 truncate pb-1 pl-2">
          <H5 className="truncate font-medium leading-none tracking-tight">
            {data.title}
          </H5>
        </CardHeader>
        <CardContent className="pb-2 pl-2"></CardContent>
        <CardFooter className="flex items-center justify-between pl-2">
          <P className="line-clamp-1 w-[55%] text-sm text-muted-foreground">
            {data.message}
          </P>
          <span className="truncate text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(data.createdAt), {
              addSuffix: true,
            })}
          </span>
        </CardFooter>
      </div>
    </div>
  );
}
