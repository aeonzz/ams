import React from "react";

import AccountScreen from "@/components/screens/settings/account";
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
      <AccountScreen />
    </SettingsLayout>
  );
}
