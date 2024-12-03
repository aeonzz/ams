import { useState } from "react";
import Link from "next/link";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronRight, Dot, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDepartmentNotifications } from "@/lib/hooks/use-department-notifications";

import SubMenuButton from "./sub-menu-button";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
  departmentId?: string;
  showNotification?: boolean;
}

export default function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
  departmentId,
  showNotification = false,
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  // Only fetch notifications if this is a department menu item
  const { unreadCount: notificationCount } = useDepartmentNotifications(departmentId || "");
  // Compute the final unread count based on showNotification prop
  const unreadCount = showNotification ? notificationCount : 0;

  const NotificationBadge = () =>
    showNotification && unreadCount > 0 ? (
      <div className="absolute right-2 grid size-4 place-items-center rounded-full bg-red-500">
        <span className="text-[9px] leading-[1rem] text-white">
          {unreadCount}
        </span>
      </div>
    ) : null;

  return (
    <div className="w-full">
      {isOpen ? (
        <Collapsible
          open={isCollapsed}
          onOpenChange={setIsCollapsed}
          className="relative w-full"
        >
          <CollapsibleTrigger
            className="mb-1 [&[data-state=open]>div>div>svg]:rotate-90"
            asChild
          >
            <Button
              variant="ghost"
              className={cn("group relative h-8 w-full justify-start hover:bg-tertiary")}
            >
              <div className="flex w-full items-center gap-1">
                <div className="flex items-center">
                  <span className="mr-2">
                    <Icon className="size-5 opacity-70 transition-opacity group-hover:opacity-100" />
                  </span>
                  <p
                    className={cn(
                      "max-w-[150px] truncate",
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-96 opacity-0"
                    )}
                  >
                    {label}
                  </p>
                </div>
                <div
                  className={cn(
                    "whitespace-nowrap",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  <ChevronRight
                    size={14}
                    className="duration-300 ease-out-expo"
                  />
                </div>
              </div>
              <NotificationBadge />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden pl-10 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            {submenus.map(({ href, label, active }, index) => (
              <SubMenuButton
                key={index}
                href={href}
                label={label}
                active={active}
                isOpen={isOpen}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <DropdownMenu>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    active && "bg-tertiary hover:bg-tertiary",
                    "group mb-1 h-8 w-full justify-start"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <Icon className="size-5 opacity-70 transition-opacity group-hover:opacity-100" />
                      </span>
                      <p
                        className={cn(
                          "max-w-[200px] truncate",
                          isOpen === false ? "opacity-0" : "opacity-100"
                        )}
                      >
                        {label}
                      </p>
                    </div>
                  </div>
                  <NotificationBadge />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" alignOffset={2}>
              <div className="flex items-center gap-2">
                {label}
                {unreadCount > 0 && (
                  <span className="grid size-4 place-items-center rounded-full bg-red-500">
                    <span className="text-[9px] leading-[1rem] text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            side="right"
            sideOffset={25}
            align="start"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="max-w-[190px] truncate">
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {submenus.map(({ href, label }, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link className="cursor-pointer" href={href} prefetch>
                  <p className="max-w-[180px] truncate">{label}</p>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuArrow className="fill-border" />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
