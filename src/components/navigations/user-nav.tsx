"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, SquarePen } from "lucide-react";

import { signOutAction } from "@/lib/actions/users";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "../ui/button";
import CommandTooltip from "../ui/command-tooltip";
import { CommandShortcut } from "../ui/command";

interface UserNavProps {
  isOpen: boolean | undefined;
}

export default function UserNav({ isOpen }: UserNavProps) {
  const currentUser = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const dialog = useDialog();

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
          className="data-[state=open]:bg-accent [&[data-state=open]>svg]:rotate-180"
        >
          <Button variant="ghost" className="w-auto space-x-2 px-3">
            <Avatar className="size-7 rounded-md">
              <AvatarImage src={currentUser.profileUrl ?? ""} />
              <AvatarFallback className="rounded-md">
                {currentUser.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p
              className={cn(
                "whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-out-expo",
                isOpen === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              {currentUser.username.slice(0, 10)}
              {currentUser.username &&
                currentUser.username.length >= 10 &&
                "..."}
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
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => dialog.setActiveDialog("requestDialog")}
              >
                <SquarePen className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <CommandTooltip text="Create request">
                <CommandShortcut>Alt</CommandShortcut>
                <CommandShortcut>C</CommandShortcut>
              </CommandTooltip>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
