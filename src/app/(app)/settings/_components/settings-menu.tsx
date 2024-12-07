"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { getSettingsList } from "@/config/settings-list";
import { cn } from "@/lib/utils";

import SettingsMenuButton from "./settings-menu-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const settingsList = getSettingsList(pathname);

  if (isDesktop) {
    return (
      <div className="space-y-3">
        <nav className="h-full w-full">
          <ul className="flex flex-col items-start space-y-1">
            {settingsList.map(({ groupLabel, menus }, index) => (
              <li className={cn("w-full", groupLabel ? "pt-1" : "")} key={index}>
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">{groupLabel}</p>
                {menus.map(({ href, label, active }, index) => (
                  <div className="w-full border-l" key={index}>
                    <SettingsMenuButton active={active} label={label} href={href} />
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <Tabs defaultValue={pathname} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {settingsList.flatMap(({ menus }) =>
            menus.map(({ href, label, active }) => (
              <TabsTrigger
                key={href}
                value={href}
                onClick={() => router.push(href)}
                className={cn(
                  "flex-shrink-0",
                  active && "bg-accent text-accent-foreground"
                )}
              >
                {label}
              </TabsTrigger>
            ))
          )}
        </TabsList>
      </Tabs>
    );
  }
}

