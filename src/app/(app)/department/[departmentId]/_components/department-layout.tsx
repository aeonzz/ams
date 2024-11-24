"use client";

import { P } from "@/components/typography/text";
import React from "react";
import OverviewNavigationMenu from "./navigation-menu";
import SearchInput from "@/app/(app)/_components/search-input";
import BackButton from "@/components/back-button";

interface DepartmentLayoutProps {
  departmentId: string;
  children: React.ReactNode;
  name: string;
  withBackButton?: boolean;
}

export default function DepartmentLayout({
  departmentId,
  name,
  children,
  withBackButton = false,
}: DepartmentLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          {withBackButton && <BackButton />}
          <P className="font-medium">{name}</P>
        </div>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu departmentId={departmentId} />
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar container flex flex-1 justify-center overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
