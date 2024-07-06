import React from "react";

import ContentLayout from "@/components/navigations/content-layout";
import PreferencesScreen from "@/components/screens/settings/preferences";

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
      <PreferencesScreen />
    </ContentLayout>
  );
}
