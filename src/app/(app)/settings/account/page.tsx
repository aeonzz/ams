import React from "react";

import ContentLayout from "@/components/navigations/content-layout";
import AccountScreen from "@/components/screens/account";

export default function Page() {
  return (
    <ContentLayout title="Settings">
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
      <AccountScreen />
    </ContentLayout>
  );
}
