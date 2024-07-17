import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface SettingsMenuButtonProps {
  active: boolean;
  href: string;
  label: string;
}

export default function SettingsMenuButton({
  active,
  href,
  label,
}: SettingsMenuButtonProps) {
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
        <p className={cn("max-w-[200px] truncate")}>{label}</p>
      </Link>
    </Button>
  );
}
