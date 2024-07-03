import { User } from 'prisma/generated/zod';
import { ThemeToggle } from '../ui/theme-toggle';
import SheetMenu from './sheet-menu';

interface NavbarProps {
  title: string;
  currentUser: User;
}

export default function Navbar({ title, currentUser }: NavbarProps) {
  return (
    <header className="sticky top-0 w-full border-b">
      <div className="mx-4 flex py-1 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu currentUser={currentUser} />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
