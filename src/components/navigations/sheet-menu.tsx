import { MenuIcon, PanelsTopLeft } from "lucide-react";
import { User } from "prisma/generated/zod";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import MainMenu from "./main-menu";
import UserNav from "./user-nav";

export default function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="secondary" size="icon">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-0 px-3 py-3 sm:w-72" side="left">
        <UserNav isOpen />
        <MainMenu isOpen />
      </SheetContent>
    </Sheet>
  );
}
