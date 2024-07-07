"use client";

import { InboxIcon, SlidersHorizontal } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function Inbox() {
  return (
    <div className="h-full w-1/3">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <h3 className="text-sm font-medium">Notification</h3>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "ghost2", size: "icon" }))}
          >
            <SlidersHorizontal className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            loop
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <InboxIcon className="size-16" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No notifications</p>
        </div>
      </div>
    </div>
  );
}
