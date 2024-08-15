import React from "react";
import Link from "next/link";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface SubMenuButtonProps {
  href: string;
  label: string;
  active: boolean;
  isOpen: boolean | undefined;
}

export default function SubMenuButton({
  href,
  label,
  active,
  isOpen,
}: SubMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        active && "bg-tertiary hover:bg-tertiary",
        "mb-1 h-10 w-full justify-start"
      )}
      asChild
    >
      <Link href={href}>
        <span className="ml-2 mr-4">
          <Dot size={18} />
        </span>
        <p
          className={cn(
            "max-w-[170px] truncate",
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0"
          )}
        >
          {label}
        </p>
      </Link>
    </Button>
  );
}
