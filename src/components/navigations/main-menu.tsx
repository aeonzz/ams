'use client';

import { Ellipsis, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import React, { useMemo } from 'react';
import CollapseMenuButton from './collapse-menu-button';
import UserNav from './user-nav';
import { User } from 'prisma/generated/zod';
import { getMenuList } from '@/config/menu-list';
import MenuButton from './menu-button';

interface MainMenuProps {
  isOpen: boolean | undefined;
  currentUser: User;
}

export default function MainMenu({ isOpen, currentUser }: MainMenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  return (
    <>
      <UserNav currentUser={currentUser} isOpen={isOpen} />
      <ScrollArea className="[&>div>div[style]]:!block">
        <nav className="h-full w-full">
          <ul className="flex flex-col items-start space-y-1">
            {menuList.map(({ groupLabel, menus }, index) => (
              <li
                className={cn('w-full', groupLabel ? 'pt-1' : '')}
                key={index}
              >
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                    {groupLabel}
                  </p>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="flex w-full items-center justify-center">
                          <Ellipsis className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="pb-2"></p>
                )}
                {menus.map(
                  ({ href, label, icon: Icon, active, submenus }, index) => {
                    const memoizedSubmenus = useMemo(
                      () => submenus,
                      [submenus]
                    );
                    return submenus.length === 0 ? (
                      <div className="w-full" key={index}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <MenuButton
                                icon={Icon}
                                label={label}
                                active={active}
                                isOpen={isOpen}
                                href={href}
                              />
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={index}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={active}
                          submenus={memoizedSubmenus}
                          isOpen={isOpen}
                        />
                      </div>
                    );
                  }
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </>
  );
}
