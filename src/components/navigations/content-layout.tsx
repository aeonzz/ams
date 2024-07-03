import { User } from 'prisma/generated/zod';
import Navbar from './navbar';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  currentUser: User;
}

export default function ContentLayout({
  title,
  children,
  currentUser,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} currentUser={currentUser} />
      <div className="w-full px-4 pb-8 pt-8 sm:px-8">{children}</div>
    </div>
  );
}
