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

interface MenuSheetProps {
  className?: string;
}

export default function MenuSheet({ className }: MenuSheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("mr-1 size-8", className)}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="h-full overflow-hidden rounded-r-[10px] px-1"
        side="left"
        hideClose
      >
        <SheetHeader className="pt-0"></SheetHeader>
        <div className="scroll-bar overflow-y-auto">
          <MainMenu isOpen />
        </div>
      </SheetContent>
    </Sheet>
  );
}
