"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { useUserNotifications } from "@/lib/hooks/use-user-notifications";
import { useSession } from "@/lib/hooks/use-session";

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  isOpen: boolean | undefined;
  href: string;
}

export default function MenuButton({
  icon: Icon,
  label,
  active,
  isOpen,
  href,
}: MenuButtonProps) {
  const currentUser = useSession();

  const { unreadCount } = useUserNotifications(currentUser.id);

  const hasUnreadNotifications = unreadCount > 0;
  return (
    <Button
      variant="ghost"
      className={cn(
        active && "bg-tertiary hover:bg-tertiary",
        "group mb-1 h-8 w-full justify-start"
      )}
      asChild
    >
      <Link href={href} prefetch className="relative">
        <span className={cn(isOpen === false ? "" : "mr-2")}>
          <Icon className="size-5 opacity-70 transition-opacity group-hover:opacity-100" />
        </span>
        <p
          className={cn(
            "max-w-[200px] truncate",
            isOpen === false ? "-translate-x-96" : "translate-x-0 opacity-100"
          )}
        >
          {label}
        </p>
        {label === "Notifications" && hasUnreadNotifications && (
          <div className="absolute right-2 grid size-4 place-items-center rounded-full bg-red-500">
            <span className="text-[9px] leading-[1rem] text-white">{unreadCount}</span>
          </div>
        )}
      </Link>
    </Button>
  );
}
