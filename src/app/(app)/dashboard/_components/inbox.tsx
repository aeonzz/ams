import React, { useEffect, useRef } from "react";
import { InboxIcon } from "lucide-react";
import { P } from "@/components/typography/text";
import NotificationCard from "../../notification/_components/notification-card";
import type { NotificationWithRelations } from "prisma/generated/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface InboxProps {
  className?: string;
  notifications: NotificationWithRelations[] | undefined;
  onNotificationSelect: (notificationId: string) => void;
  selectedNotificationId: string | null;
  status: "pending" | "error" | "success";
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

export default function Inbox({
  className,
  notifications,
  onNotificationSelect,
  selectedNotificationId,
  status,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InboxProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

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
      return Array.from({ length: 10 }).map((_, index) => (
        <NotificationSkeleton key={index} />
      ));
    }

    if (status === "error") {
      return (
        <P className="text-center text-red-500">Error loading notifications</P>
      );
    }

    if (!notifications || notifications.length === 0) {
      return (
        <div className="flex h-[calc(100vh_-_80px)] items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <InboxIcon className="size-16" strokeWidth={1} />
            <P className="text-muted-foreground">No notifications</P>
          </div>
        </div>
      );
    }

    return notifications.map((notification: NotificationWithRelations) => (
      <NotificationCard
        key={notification.id}
        data={notification}
        onClick={() => onNotificationSelect(notification.id)}
        isSelected={selectedNotificationId === notification.id}
      />
    ));
  };

  return (
    <div className={className}>
      <div className="scroll-bar h-[calc(100vh-64px)] overflow-y-auto p-1">
        {renderNotifications()}
        {hasNextPage && isFetchingNextPage && <NotificationSkeleton />}
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
