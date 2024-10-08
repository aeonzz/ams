"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { ScrollArea } from "@/components/ui/scroll-area";
import { P } from "@/components/typography/text";
import Inbox from "../../dashboard/_components/inbox";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Notification } from "prisma/generated/zod";

export default function NotificationScreen() {
  const currentUser = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedNotificationId = searchParams.get("notificationId");

  const { data: selectedNotification, isLoading } = useQuery<Notification>({
    queryKey: ["notification", selectedNotificationId],
    queryFn: async () => {
      if (!selectedNotificationId) return null;
      const res = await axios.get(
        `/api/notification/get-notification-by-id/${selectedNotificationId}`
      );
      return res.data.data;
    },
    enabled: !!selectedNotificationId,
  });

  console.log(selectedNotification)

  const handleNotificationSelect = (notificationId: string) => {
    router.push(`/notification?notificationId=${notificationId}`);
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-[36%] border-r">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Notifications</P>
        </div>
        <Inbox
          className="w-full"
          onNotificationSelect={handleNotificationSelect}
          selectedNotificationId={selectedNotificationId}
        />
      </div>
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Notification Details</P>
        </div>
        <ScrollArea className="h-[calc(100%-50px)] p-4">
          {isLoading ? (
            <P>Loading notification details...</P>
          ) : selectedNotification ? (
            <div>
              <h2 className="mb-4 text-2xl font-bold">
                {selectedNotification.title}
              </h2>
              <P className="mb-2 text-muted-foreground">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </P>
              <P>{selectedNotification.message}</P>
            </div>
          ) : (
            <P>Select a notification to view details</P>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
