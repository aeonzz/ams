import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import MainMenu from "../../_components/main-menu";

export default function MenuSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="mr-1 size-8">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[50%] overflow-hidden px-1">
        <DrawerHeader></DrawerHeader>
        <div className="scroll-bar overflow-y-auto">
          <MainMenu isOpen />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
