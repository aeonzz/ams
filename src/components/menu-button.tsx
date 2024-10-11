import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  isOpen: boolean | undefined;
  href: string;
  hasUnreadNotifications?: boolean | undefined;
}

export default function MenuButton({
  icon: Icon,
  label,
  active,
  isOpen,
  href,
  hasUnreadNotifications,
}: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        active && "bg-tertiary hover:bg-tertiary",
        "mb-1 h-8 w-full justify-start"
      )}
      asChild
    >
      <Link href={href} prefetch>
        <span className={cn(isOpen === false ? "" : "mr-3")}>
          <div className="relative">
            {label === "Notifications" && hasUnreadNotifications && (
              <span className="h-2 w-2 top-0 left-2.5 absolute rounded-full bg-red-500"></span>
            )}
            <Icon className="size-5" />
          </div>
        </span>
        <p
          className={cn(
            "max-w-[200px] truncate",
            isOpen === false ? "-translate-x-96" : "translate-x-0 opacity-100"
          )}
        >
          {label}
        </p>
      </Link>
    </Button>
  );
}
