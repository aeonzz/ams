import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job requests",
};

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
