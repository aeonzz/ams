import CommandLayout from '@/components/layouts/command-layout';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import FetchDataError from '@/components/screens/fetch-data-error';
import { currentUser } from '@/lib/actions/users';
import { checkAuth } from '@/lib/auth/utils';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const [data] = await currentUser();

  if (!data) {
    return <FetchDataError />;
  }

  return (
    <DashboardLayout currentUser={data}>
      <CommandLayout>{children}</CommandLayout>
    </DashboardLayout>
  );
}
