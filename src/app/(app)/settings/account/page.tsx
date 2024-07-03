import ContentLayout from '@/components/navigations/content-layout';
import FetchDataError from '@/components/screens/fetch-data-error';
import { currentUser } from '@/lib/actions/users';
import React from 'react';

export default async function Page() {
  const [data] = await currentUser();

  if (!data) {
    return <FetchDataError />;
  }
  return (
    <ContentLayout title="Account" currentUser={data}>
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
      asdasd
    </ContentLayout>
  );
}
