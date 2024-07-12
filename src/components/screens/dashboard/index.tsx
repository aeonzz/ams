"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/hooks/use-session";
import Inbox from "./inbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus } from "lucide-react";
import { useDialog } from "@/lib/hooks/use-dialog";
import { P } from "@/components/typography/text";

export default function DashboardScreen() {
  const currentUser = useSession();
  console.log(currentUser);
  const dialog = useDialog();
  const username = `${currentUser.username.charAt(0).toUpperCase()}${currentUser.username.slice(1)}`;

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Dashboard</P>
        </div>
        <ScrollArea className="h-full p-3">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">
              Good day,{" "}
              <span className="text-muted-foreground">{username}</span>
            </h1>
            <Button
              variant="shine"
              onClick={() => dialog.setActiveDialog("requestDialog")}
            >
              <CirclePlus className="mr-2 size-5" />
              Create request
            </Button>
          </div>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-full" />
      <Inbox />
    </div>
  );
}
