"use client";

import React, { useState } from "react";

import { useSession } from "@/lib/hooks/use-session";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { H1, H2, H3, P } from "@/components/typography/text";
import AdminSearchInput from "../../_components/admin-search-input";

export default function AdminDashboardScreen() {
  const currentUser = useSession();

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Overview</P>
          <AdminSearchInput />
        </div>
        <ScrollArea className="h-[calc(100vh_-_68px)] py-3"></ScrollArea>
      </div>
    </div>
  );
}
