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
}

export default function MenuButton({
  icon: Icon,
  label,
  active,
  isOpen,
  href,
}: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        active && "bg-tertiary hover:bg-tertiary",
        "mb-1 h-10 w-full justify-start"
      )}
      asChild
    >
      <Link href={href} prefetch>
        <span className={cn(isOpen === false ? "" : "mr-4")}>
          <Icon className="size-5" />
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
