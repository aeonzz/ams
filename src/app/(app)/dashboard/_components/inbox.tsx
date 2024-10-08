"use client";

import { InboxIcon, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "@/lib/hooks/use-session";
import NotificationCard from "../../notification/_components/notification-card";
import { type Notification } from "prisma/generated/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const ITEMS_PER_PAGE = 10;

interface InboxProps {
  className?: string;
  onNotificationSelect: (notificationId: string) => void;
  selectedNotificationId: string | null;
}

export default function Inbox({
  className,
  onNotificationSelect,
  selectedNotificationId,
}: InboxProps) {
  const currentUser = useSession();
  const observerTarget = useRef(null);

  const fetchNotifications = async ({ pageParam = 1 }) => {
    const res = await axios.get(
      `/api/notification/get-user-notification/${currentUser.id}?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
    );
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["get-user-notifications-departments", currentUser.id],
      queryFn: fetchNotifications,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
        return pages.length + 1;
      },
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderNotifications = () => {
    if (status === "pending") {
      return Array.from({ length: 5 }).map((_, index) => (
        <NotificationSkeleton key={index} />
      ));
    }

    if (status === "error") {
      return (
        <P className="text-center text-red-500">Error loading notifications</P>
      );
    }

    if (data?.pages[0].data.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <InboxIcon className="size-16" strokeWidth={1} />
            <P className="text-muted-foreground">No notifications</P>
          </div>
        </div>
      );
    }

    return data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page.data.map((notification: Notification) => (
          <NotificationCard
            key={notification.id}
            data={notification}
            onClick={() => onNotificationSelect(notification.id)}
            isSelected={selectedNotificationId === notification.id}
          />
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div className={(cn("h-auto"), className)}>
      <div className="scroll-bar h-[calc(100%-50px)] overflow-y-auto p-1">
        {renderNotifications()}
        {isFetchingNextPage && <NotificationSkeleton />}
        <div ref={observerTarget} />
      </div>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="mb-1 flex w-full rounded-md border">
      <div className="py-5 pl-3">
        <Skeleton className="size-2.5 rounded-full" />
      </div>
      <div className="w-[calc(100%_-_28px)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 truncate pb-1 pl-2">
          <Skeleton className="h-5 w-3/4" />
        </CardHeader>
        <CardContent className="pb-2 pl-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-2/3" />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <div className="flex flex-col">
            <Skeleton className="h-3 w-20" />
          </div>
        </CardFooter>
      </div>
    </div>
  );
}
