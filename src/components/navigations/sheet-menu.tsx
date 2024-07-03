import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';
import Link from 'next/link';
import Menu from './menu';
import UserNav from './user-nav';
import { User } from 'prisma/generated/zod';

interface SheetMenuProps {
  currentUser: User;
}

export default function SheetMenu({ currentUser }: SheetMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="secondary" size="icon">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col gap-0 px-3 py-3 sm:w-72"
        side="left"
      >
        <UserNav currentUser={currentUser} isOpen />
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
