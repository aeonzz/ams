"use client";

import React, { useState } from "react";

import { useSession } from "@/lib/hooks/use-session";
import { ScrollArea } from "@/components/ui/scroll-area";
import { P } from "@/components/typography/text";

export default function NotificationScreen() {
  const currentUser = useSession();

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Notifications</P>
        </div>
        <ScrollArea className="h-full py-3"></ScrollArea>
      </div>
    </div>
  );
}
