"use client";

import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/hooks/use-session";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus, Menu, SlidersHorizontal } from "lucide-react";
import { H1, H2, H3, P } from "@/components/typography/text";
import PendingRequest from "./pending-requests";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import UserRequestOverview from "./user-request-overview";
import SearchInput from "../../_components/search-input";
import { cn, formatFullName } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import MenuSheet from "./menu-sheet";

export default function DashboardScreen() {
  const currentUser = useSession();
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          {!isDesktop && <MenuSheet />}
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
            {isDesktop && (
              <Button
                variant="shine"
                onClick={() => dialogManager.setActiveDialog("requestDialog")}
                className=""
              >
                <CirclePlus className="mr-2 size-5 text-yellow" />
                Create request
              </Button>
            )}
          </div>
          <Separator className="mb-3" />
          <UserRequestOverview isDesktop={isDesktop} />
        </div>
      </div>
    </div>
  );
}
