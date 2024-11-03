"use client";

import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/hooks/use-session";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import { H1, H2, H3, P } from "@/components/typography/text";
import PendingRequest from "./pending-requests";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import UserRequestOverview from "./user-request-overview";
import SearchInput from "../../_components/search-input";
import { cn, formatFullName } from "@/lib/utils";

export default function DashboardScreen() {
  const currentUser = useSession();
  const dialogManager = useDialogManager();

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Dashboard</P>
          <SearchInput />
        </div>
        <div className="scroll-bar h-[calc(100vh_-_68px)] overflow-y-auto py-3">
          <div className="mb-3 flex items-center justify-between px-3">
            <H2 className="font-semibold tracking-tight">
              Good day,{" "}
              <span className="text-muted-foreground">
                {formatFullName(
                  currentUser.firstName,
                  currentUser.middleName,
                  currentUser.lastName
                )}
              </span>
            </H2>
            <Button
              variant="shine"
              onClick={() => dialogManager.setActiveDialog("requestDialog")}
              className="text-slate-100 dark:text-foreground"
            >
              <CirclePlus className="mr-2 size-5" />
              Create request
            </Button>
          </div>
          <Separator className="mb-3" />
          <UserRequestOverview />
        </div>
      </div>
      {/* <Separator orientation="vertical" className="h-full" />
      <div className="w-[30%]">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Notification</P>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost2", size: "icon" })
              )}
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
        <Inbox />
      </div> */}
    </div>
  );
}
