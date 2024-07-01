import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserAuth();
  if (session?.session) redirect('/dashboard');

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6">
      {children}
    </div>
  );
}
