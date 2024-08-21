"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/hooks/use-session";
import Inbox from "./inbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { H1, H2, H3, P } from "@/components/typography/text";
import PendingRequestOverview from "@/components/card/pending-request-overview";
import PendingRequest from "./pending-requests";
import TotalRequestOverview from "@/components/card/total-request-overview";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

export default function DashboardScreen() {
  const currentUser = useSession();
  const dialogManager = useDialogManager();
  const username = `${currentUser.username.charAt(0).toUpperCase()}${currentUser.username.slice(1)}`;

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Dashboard</P>
        </div>
        <ScrollArea className="h-[calc(100vh_-_68px)] py-3">
          <div className="mb-3 flex justify-between px-3">
            <H1 className="font-semibold tracking-tight">
              Good day,{" "}
              <span className="text-muted-foreground">{username}</span>
            </H1>
            <Button
              variant="shine"
              onClick={() => dialogManager.setActiveDialog("requestDialog")}
            >
              <CirclePlus className="mr-2 size-5" />
              Create request
            </Button>
          </div>
          <Separator className="mb-3" />
          <div className="grid grid-cols-2 gap-3 px-3">
            <PendingRequestOverview />
            <TotalRequestOverview />
          </div>
          <div className="mt-3 flex flex-col px-3">
            <H3 className="font-semibold text-muted-foreground">
              Pending requests
            </H3>
            <PendingRequest />
          </div>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <Inbox />
    </div>
  );
}
