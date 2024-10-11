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
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  notification: Notification[];
}

export default function DashboardLayout({
  children,
  notification,
}: DashboardLayoutProps) {
  const router = useRouter();
  const sidebar = useStore(useSidebarToggle, (state) => state);

  React.useEffect(() => {
    const handleNotification = () => {
      console.log("Notification received in DashboardLayout");
      router.refresh();
    };

    socket.on("notifications", handleNotification);

    return () => {
      socket.off("notifications", handleNotification);
    };
  }, []);

  const hasUnreadNotifications = React.useMemo(() => {
    return notification?.some((notification) => !notification.isRead);
  }, [notification]);

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
