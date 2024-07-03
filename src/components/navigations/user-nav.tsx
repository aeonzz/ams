'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { User } from 'prisma/generated/zod';
import { cn } from '@/lib/utils';
import { ChevronDown, SquarePen } from 'lucide-react';
import { signOutAction } from '@/lib/actions/users';
import { useDialog } from '@/lib/hooks/use-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface UserNavProps {
  currentUser: User;
  isOpen: boolean | undefined;
}

export default function UserNav({ currentUser, isOpen }: UserNavProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createRequest = useDialog();
  async function handleLogout(e: Event) {
    e.preventDefault();
    setIsLoading(true);
    await signOutAction();
  }

  return (
    <div className="flex h-auto w-full items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="[&[data-state=open]>svg]:rotate-180 data-[state=open]:bg-accent"
        >
          <Button variant="ghost" className="w-auto space-x-2 px-3">
            <Avatar className="size-7 rounded-md">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="rounded-md">CN</AvatarFallback>
            </Avatar>
            <p
              className={cn(
                'whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-out-expo',
                isOpen === false
                  ? 'hidden -translate-x-96 opacity-0'
                  : 'translate-x-0 opacity-100'
              )}
            >
              {currentUser.name?.slice(0, 10)}
              {currentUser.name && currentUser.name.length >= 10 && '...'}
            </p>
            {isOpen && (
              <ChevronDown className="size-5 duration-300 ease-out-expo" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          loop
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-52"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/account" prefetch>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => handleLogout(e)}
            disabled={isLoading}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && (
        <Button
          variant="secondary"
          size="icon"
          onClick={() => createRequest.setCreateRequest(true)}
        >
          <SquarePen className="size-5" />
        </Button>
      )}
    </div>
  );
}
