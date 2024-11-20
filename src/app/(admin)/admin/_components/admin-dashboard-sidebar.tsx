import { cn } from "@/lib/utils";

import AdminMainMenu from "./admin-main-menu";
import SidebarToggle from "@/components/sidebar-toggle";
import { SidebarStore } from "@/lib/hooks/use-sidebar";

interface AdminDashboardSidebarProps {
  sidebar: SidebarStore;
}

export default function AdminDashboardSidebar({
  sidebar,
}: AdminDashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        !sidebar.getOpenState() ? "w-[76px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar.isOpen} setIsOpen={sidebar.toggleOpen} />
      <div
        onMouseEnter={() => sidebar.setIsHover(true)}
        onMouseLeave={() => sidebar.setIsHover(false)}
        className="relative flex h-full flex-col overflow-y-auto px-3 py-3"
      >
        <AdminMainMenu isOpen={sidebar.getOpenState()} />
      </div>
    </aside>
  );
}
