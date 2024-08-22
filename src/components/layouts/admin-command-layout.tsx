import React from "react";

import CommandSearchDialog from "../dialogs/command-search-dialog";
import ThemeDialog from "../dialogs/theme-dialog";
import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import SettingsDialog from "../dialogs/settings-dialog";

export default function AdminCommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <CommandSearchDialog>
        <ThemeDialog />
        <SettingsDialog />
      </CommandSearchDialog>
      <RequestOption /> */}
      {children}
    </>
  );
}
