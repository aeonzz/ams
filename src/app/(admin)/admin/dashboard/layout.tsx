import React from "react";

import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import AdminCommandSearchDialog from "@/components/dialogs/admin-command-search-dialog";

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminCommandSearchDialog>
        <ThemeDialog />
        <SettingsDialog />
      </AdminCommandSearchDialog>
      {children}
    </>
  );
}
