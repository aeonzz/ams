'use client';

import { cn } from '@/lib/utils';
import DashboardSidebar from '../navigations/dashboard-sidebar';
import { useStore } from '@/lib/hooks/use-store';
import { useSidebarToggle } from '@/lib/hooks/use-sidebar-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  
  if (!sidebar) return null;

  return (
    <>
      <DashboardSidebar />
      <main
        className={cn(
          'h-auto bg-background p-2 pl-0 transition-[margin-left] duration-300 ease-in-out',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        <div className="min-h-[calc(100vh_-_16px)] w-full rounded-md border bg-secondary">
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
