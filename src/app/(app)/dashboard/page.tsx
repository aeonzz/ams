import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ContentLayout from '@/components/navigations/content-layout';
import DashboardScreen from '@/components/screens/dashboard';
import { currentUser } from '@/lib/actions/users';
import FetchDataError from '@/components/screens/fetch-data-error';

export default async function DashboardPage() {
  const [data] = await currentUser();

  if (!data) {
    return <FetchDataError />;
  }
  return (
    <ContentLayout title="Dashboard" currentUser={data}>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <DashboardScreen />
    </ContentLayout>
  );
}
