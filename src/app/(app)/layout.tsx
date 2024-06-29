import DashboardLayout from '@/components/layouts/dashboard-layout';
import { checkAuth } from '@/lib/auth/utils';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return <DashboardLayout>{children}</DashboardLayout>;
}
