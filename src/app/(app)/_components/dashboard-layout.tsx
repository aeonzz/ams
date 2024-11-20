"use client";

import React from "react";
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { useStore } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils";
import DashboardSidebar from "./dashboard-sidebar";
import { useSidebar } from "@/lib/hooks/use-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  return (
    <>
      <DashboardSidebar sidebar={sidebar} />
      <main
        vaul-drawer-wrapper=""
        className={cn(
          "lg:h-auto lg:p-2 lg:pl-0 h-screen bg-background transition-[margin-left] duration-300 ease-out-expo",
          !sidebar.getOpenState() ? "lg:ml-[76px]" : "lg:ml-72"
        )}
      >
        <div className="lg:h-[calc(100vh_-_16px)] lg:rounded-md lg:border h-full w-full overflow-hidden bg-secondary">
          {children}
        </div>
      </main>
    </>
  );
}
