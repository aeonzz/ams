'use client';

import { cn } from '@/lib/utils';
import SidebarToggle from './sidebar-toggle';
import { User } from 'prisma/generated/zod';
import { usePathname } from 'next/navigation';
import MainMenu from './main-menu';
import SettingsMenu from './settings-menu';

interface DashboardSidebarProps {
  isOpen: boolean | undefined;
  setIsOpen: () => void;
  currentUser: User;
}

export default function DashboardSidebar({
  isOpen,
  setIsOpen,
  currentUser,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-out-expo lg:translate-x-0',
        isOpen === false ? 'w-[76px]' : 'w-72'
      )}
    >
      {!pathname.startsWith('/settings') && (
        <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-3">
        {pathname.startsWith('/dashboard') ? (
          <MainMenu isOpen={isOpen} currentUser={currentUser} />
        ) : (
          <SettingsMenu />
        )}
      </div>
    </aside>
  );
}
