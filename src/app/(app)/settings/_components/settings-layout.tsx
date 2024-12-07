'use client'

import React from "react";
import { useMediaQuery } from "usehooks-ts";

import SettingsMenu from "./settings-menu";
import { P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import MobileMenu from "@/components/mobile-menu";
import SearchInput from "../../_components/search-input";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsLayout({
  title,
  children,
}: SettingsLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");

  return (
    <section className="h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <div className="flex items-center gap-1">
            <MobileMenu>
              <P className="font-medium">Settings</P>
            </MobileMenu>
          </div>
          <SearchInput />
        </div>
      </div>
      {!isDesktop && (
        <div className="px-3 py-2">
          <SettingsMenu />
        </div>
      )}
      <div className={cn("flex h-full", isDesktop ? "px-12 py-6" : "px-3 py-4")}>
        {isDesktop && <SettingsMenu />}
        {children}
      </div>
    </section>
  );
}

