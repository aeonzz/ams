"use client";

import { usePathname } from "next/navigation";
import { User } from "prisma/generated/zod";

import { cn } from "@/lib/utils";

import MainMenu from "./main-menu";
import SettingsMenu from "./settings-menu";
import SidebarToggle from "./sidebar-toggle";

interface DashboardSidebarProps {
  isOpen: boolean | undefined;
  setIsOpen: () => void;
}

export default function DashboardSidebar({
  isOpen,
  setIsOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-out-expo lg:translate-x-0",
        isOpen === false ? "w-[76px]" : "w-72"
      )}
    >
      {!pathname.startsWith("/settings") && (
        <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-3">
        {pathname.startsWith("/settings") ? (
          <SettingsMenu />
        ) : (
          <MainMenu isOpen={isOpen} />
        )}
      </div>
    </aside>
  );
}
