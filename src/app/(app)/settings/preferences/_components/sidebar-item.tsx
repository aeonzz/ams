"use client";

import React from "react";
import {
  SectionItem,
  SectionItemAction,
  SectionItemDescription,
  SectionItemHeader,
  SectionItemTitle,
} from "../../_components/section";
import { useStore } from "@/lib/hooks/use-store";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import { Switch } from "@/components/ui/switch";

export default function SideBarItem() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionItemTitle>Sidebar Hover Behavior</SectionItemTitle>
        <SectionItemDescription>
          Enable or disable opening the sidebar on hover.
        </SectionItemDescription>
      </SectionItemHeader>
      <SectionItemAction className="justify-center">
        <Switch
          id="is-hover-open"
          onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
          checked={settings.isHoverOpen}
        />
      </SectionItemAction>
    </SectionItem>
  );
}
