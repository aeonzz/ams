import { cn } from "@/lib/utils";

import SidebarToggle from "../../../components/sidebar-toggle";
import AdminMainMenu from "./admin-main-menu";

interface AdminDashboardSidebarProps {
  isOpen: boolean | undefined;
  setIsOpen: () => void;
}

export default function AdminDashboardSidebar({
  isOpen,
  setIsOpen,
}: AdminDashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-out-expo lg:translate-x-0",
        isOpen === false ? "w-[76px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-3">
        <AdminMainMenu isOpen={isOpen} />
      </div>
    </aside>
  );
}
