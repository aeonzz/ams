"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Cog, LogOut, SquarePen } from "lucide-react";

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
import { Button } from "./ui/button";
import { P } from "./typography/text";

interface UserNavProps {
  isOpen: boolean | undefined;
}

export default function UserNav({ isOpen }: UserNavProps) {
  const currentUser = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout(e: Event) {
    e.preventDefault();
    setIsLoading(true);
    await signOutAction();
  }

  return (
    <div className="items-centere flex h-auto w-full">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="data-[state=open]:bg-accent [&[data-state=open]>svg]:rotate-180"
          asChild
        >
          <Button
            variant="ghost"
            className="flex w-full justify-between truncate px-3 py-3"
          >
            <Avatar className="mr-2 size-7 rounded-md">
              <AvatarImage src={`${currentUser.profileUrl}`} />
              <AvatarFallback className="rounded-md">
                {currentUser.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="w-44">
              <P
                className={cn(
                  "truncate whitespace-nowrap text-start font-semibold tracking-tight transition-[transform,opacity,display] duration-300 ease-out-expo",
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
              </P>
              <p
                className={cn(
                  "truncate whitespace-nowrap text-start text-xs tracking-tight text-muted-foreground",
                  isOpen === false
                    ? "hidden -translate-x-96 opacity-0"
                    : "translate-x-0 opacity-100"
                )}
              >
                {currentUser.email}
              </p>
            </div>
            {isOpen && (
              <ChevronDown className="ml-auto size-5 duration-300 ease-out-expo" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[264px]"
          side={isOpen ? "bottom" : "right"}
        >
          <DropdownMenuLabel>
            {formatFullName(
              currentUser.firstName,
              currentUser.middleName,
              currentUser.lastName
            )}
            <p className="truncate whitespace-nowrap text-start text-xs tracking-tight text-muted-foreground">
              {currentUser.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/settings/account" prefetch>
            <DropdownMenuItem>
              <Cog className="mr-2 size-5" />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => handleLogout(e)}
            disabled={isLoading}
          >
            <LogOut className="mr-2 size-5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
