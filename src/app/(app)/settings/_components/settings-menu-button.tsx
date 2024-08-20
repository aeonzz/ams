import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "../../../../components/ui/button";
import { P } from "../../../../components/typography/text";

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
      variant="link"
      className={cn(
        active && "border-primary",
        "-ml-[1px] w-40 justify-start rounded-none border-l text-foreground hover:bg-transparent hover:no-underline"
      )}
      asChild
    >
      <Link href={href} prefetch>
        <P className={cn(active && "text-primary", "max-w-[200px] truncate")}>
          {label}
        </P>
      </Link>
    </Button>
  );
}
