import React from "react";

import ContentLayout from "@/components/navigations/content-layout";
import AppearanceScreen from "@/components/screens/settings/appearance";

export default function Page() {
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
    <AppearanceScreen />
  </ContentLayout>;
}
