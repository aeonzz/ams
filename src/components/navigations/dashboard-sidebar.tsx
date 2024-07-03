import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SidebarToggle from './sidebar-toggle';
import Menu from './menu';
import UserNav from './user-nav';
import { User } from 'prisma/generated/zod';

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
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-out-expo lg:translate-x-0',
        isOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-3">
        <UserNav
          currentUser={currentUser}
          isOpen={isOpen}
        />
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
}
