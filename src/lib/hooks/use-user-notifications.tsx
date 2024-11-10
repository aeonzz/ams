import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "@/app/socket";
import { Notification } from "prisma/generated/zod";

const ITEMS_PER_PAGE = 10; // Adjust as needed

export const useUserNotifications = (userId: string) => {
  const fetchNotifications = async ({ pageParam = 1 }) => {
    const res = await axios.get(
      `/api/notification/get-user-notification-with-params/${userId}?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
    );
    return res.data;
  };

  const {
    data: notificationsData,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    status: notificationsStatus,
  } = useInfiniteQuery({
    queryKey: ["get-user-notifications-with-params", userId],
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.length < ITEMS_PER_PAGE
        ? undefined
        : pages.length + 1;
    },
  });

  const allNotifications = React.useMemo(() => {
    return notificationsData?.pages.flatMap((page) => page.data) || [];
  }, [notificationsData]);

  const unreadCount: number = notificationsData?.pages[0]?.unreadCount || 0;

  React.useEffect(() => {
    const handleNotification = () => {
      refetch();
    };

    socket.on("notifications", handleNotification);

    return () => {
      socket.off("notifications", handleNotification);
    };
  }, []);

  return {
    notificationsData: allNotifications,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    notificationsStatus,
    unreadCount,
  };
};
