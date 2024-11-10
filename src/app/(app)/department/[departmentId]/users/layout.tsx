import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import { RoleGuard } from "@/components/role-guard";

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RoleGuard allowedRoles={["DEPARTMENT_HEAD"]}>
        <CommandSearchDialog>
          <ThemeDialog />
          <SettingsDialog />
        </CommandSearchDialog>
        <RequestOption />
        {children}
      </RoleGuard>
    </>
  );
}
