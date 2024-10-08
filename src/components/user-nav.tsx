"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, SquarePen } from "lucide-react";

import { signOutAction } from "@/lib/actions/users";
import { useSession } from "@/lib/hooks/use-session";
import { cn, formatFullName } from "@/lib/utils";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";
import CommandTooltip from "./ui/command-tooltip";
import { CommandShortcut } from "./ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface UserNavProps {
  isOpen: boolean | undefined;
}

export default function UserNav({ isOpen }: UserNavProps) {
  const dialogManager = useDialogManager();
  const currentUser = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout(e: Event) {
    e.preventDefault();
    setIsLoading(true);
    await signOutAction();
  }

  return (
    <div className="flex h-auto w-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="data-[state=open]:bg-accent [&[data-state=open]>svg]:rotate-180"
        >
          <Button variant="ghost" className="w-auto space-x-2 truncate px-3">
            <Avatar className="size-7 rounded-md">
              <AvatarImage src={`${currentUser.profileUrl}`} />
              <AvatarFallback className="rounded-md">
                {currentUser.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p
              className={cn(
                "truncate whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-out-expo",
                isOpen === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              {formatFullName(
                currentUser.firstName,
                currentUser.middleName,
                currentUser.lastName
              )}
            </p>
            {isOpen && (
              <ChevronDown className="size-5 duration-300 ease-out-expo" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" loop>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <Link href="/settings/account" prefetch>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Settings
            </DropdownMenuItem>
          </Link>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => dialogManager.setActiveDialog("requestDialog")}
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
      )}
    </div>
  );
}
