"use client";

import React from "react";
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { useStore } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "@/app/socket";
import { type Notification, User } from "prisma/generated/zod";
import DashboardSidebar from "./dashboard-sidebar";
import { useSession } from "@/lib/hooks/use-session";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const queryClient = useQueryClient();
  const currentUser = useSession();
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const { data } = useQuery<Notification[]>({
    queryFn: async () => {
      const res = await axios.get(
        `/api/notification/get-user-notification/${currentUser.id}`
      );
      return res.data.data;
    },
    queryKey: ["get-user-notifications", currentUser.id],
    staleTime: 0,
  });

  const hasUnreadNotifications = React.useMemo(() => {
    return data?.some((notification) => !notification.isRead);
  }, [data]);

  React.useEffect(() => {
    const handleNotification = () => {
      console.log("Notification received in DashboardLayout");
      queryClient.invalidateQueries({
        queryKey: ["get-user-notifications", currentUser.id],
      });
    };

    socket.on("notifications", handleNotification);
    socket.on("request_update", handleNotification);

    // Ensure the socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("notifications", handleNotification);
      socket.off("request_update", handleNotification);
    };
  }, [queryClient, currentUser.id]);

  if (!sidebar) return null;

  return (
    <>
      <DashboardSidebar
        isOpen={sidebar.isOpen}
        setIsOpen={sidebar.setIsOpen}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      <main
        className={cn(
          "h-auto bg-background p-2 pl-0 transition-[margin-left] duration-300 ease-out-expo",
          sidebar?.isOpen === false ? "lg:ml-[76px]" : "lg:ml-72"
        )}
      >
        <div className="h-[calc(100vh_-_16px)] w-full overflow-hidden rounded-md border bg-secondary">
          {children}
        </div>
      </main>
    </>
  );
}
