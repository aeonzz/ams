import CommandLayout from '@/components/layouts/command-layout';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { checkAuth } from '@/lib/auth/utils';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <DashboardLayout>
      <CommandLayout>{children}</CommandLayout>
    </DashboardLayout>
  );
}
