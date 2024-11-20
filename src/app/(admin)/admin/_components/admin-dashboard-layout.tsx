"use client";

import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { useStore } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils";

import AdminDashboardSidebar from "./admin-dashboard-sidebar";
import { useSidebar } from "@/lib/hooks/use-sidebar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  return (
    <>
      <AdminDashboardSidebar sidebar={sidebar} />
      <main
        vaul-drawer-wrapper=""
        className={cn(
          "h-screen bg-background transition-[margin-left] duration-300 ease-in-out lg:h-auto lg:p-2 lg:pl-0",
          !sidebar.getOpenState() ? "lg:ml-[76px]" : "lg:ml-72"
        )}
      >
        <div className="h-full w-full overflow-hidden bg-secondary lg:h-[calc(100vh_-_16px)] lg:rounded-md lg:border">
          {children}
        </div>
      </main>
    </>
  );
}
