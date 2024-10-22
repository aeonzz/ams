"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

export default function SupplyMenu() {
  const dialogManager = useDialogManager();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
            onClick={() =>
              dialogManager.setActiveDialog("supplyCategoriesDialog")
            }
          >
            Categories
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
