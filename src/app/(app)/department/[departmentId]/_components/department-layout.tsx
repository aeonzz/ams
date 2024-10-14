"use client";

import { P } from "@/components/typography/text";
import React from "react";
import OverviewNavigationMenu from "./navigation-menu";
import SearchInput from "@/app/(app)/_components/search-input";

interface DepartmentLayoutProps {
  departmentId: string;
  children: React.ReactNode;
  name: string;
}

export default function DepartmentLayout({
  departmentId,
  name,
  children,
}: DepartmentLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">{name}</P>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu departmentId={departmentId} />
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        {children}
      </div>
    </div>
  );
}
