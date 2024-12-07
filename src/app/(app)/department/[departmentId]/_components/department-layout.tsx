"use client";

import { P } from "@/components/typography/text";
import React from "react";
import OverviewNavigationMenu from "./navigation-menu";
import SearchInput from "@/app/(app)/_components/search-input";
import BackButton from "@/components/back-button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import MenuSheet from "@/app/(app)/dashboard/_components/menu-sheet";
import DisableMobile from "@/components/providers/disable-mobile";

interface DepartmentLayoutProps {
  departmentId: string;
  children: React.ReactNode;
  name: string;
  withBackButton?: boolean;
  container?: boolean;
  enableMobile?: boolean;
}

export default function DepartmentLayout({
  departmentId,
  name,
  children,
  withBackButton = false,
  container = true,
  enableMobile = false,
}: DepartmentLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          {!isDesktop && <MenuSheet />}
          {withBackButton && <BackButton />}
          <P className="font-medium">{name}</P>
        </div>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu departmentId={departmentId} />
          <SearchInput />
        </div>
      </div>
      <div
        className={cn(
          "scroll-bar flex flex-1 justify-center overflow-y-auto",
          container && "container p-3"
        )}
      >
        {enableMobile ? children : <DisableMobile>{children}</DisableMobile>}
      </div>
    </div>
  );
}
