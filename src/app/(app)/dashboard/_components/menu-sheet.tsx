import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import MainMenu from "../../_components/main-menu";

export default function MenuSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="mr-1 size-8">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="h-[85%] overflow-hidden rounded-t-[10px] px-1"
        side="bottom"
        hideClose
      >
        <SheetHeader></SheetHeader>
        <div className="scroll-bar overflow-y-auto">
          <MainMenu isOpen />
        </div>
      </SheetContent>
    </Sheet>
  );
}
