import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";

export interface Props {
  children: React.ReactNode;
}

export default function CommandLayout({ children }: Props) {
  return (
    <>
      <CommandSearchDialog>
        <ThemeDialog />
        <SettingsDialog />
      </CommandSearchDialog>
      <RequestOption />
      {children}
    </>
  );
}
