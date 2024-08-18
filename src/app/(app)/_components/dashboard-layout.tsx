"use client";

import { User } from "prisma/generated/zod";

import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { useStore } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils";

import DashboardSidebar from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <DashboardSidebar isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen} />
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
