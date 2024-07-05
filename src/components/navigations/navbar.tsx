import { User } from "prisma/generated/zod";

import { ThemeToggle } from "../ui/theme-toggle";
import SheetMenu from "./sheet-menu";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 w-full border-b">
      <div className="mx-4 flex items-center py-1 sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
