import React from "react";

import PreferencesScreen from "@/components/screens/settings/preferences";
import SettingsLayout from "@/components/layouts/settings-layout";

export default function Page() {
  return (
    <SettingsLayout title="Settings">
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
    </SettingsLayout>
  );
}
