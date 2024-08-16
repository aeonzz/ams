"use client";


import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { useStore } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils";

import AdminDashboardSidebar from "../navigations/admin-dashboard-sidebar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <AdminDashboardSidebar isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen} />
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
      {/* <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
      </footer> */}
    </>
  );
}
