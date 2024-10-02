import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import { currentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";

export interface Props {
  children: React.ReactNode;
}

export default async function CommandLayout({ children }: Props) {
  const [data] = await currentUser();
  if (!data) redirect("/sign-in");

  const hasPersonnelRole = data.userRole.some(
    (userRole) => userRole.role.name === "PERSONNEL"
  );

  if (!hasPersonnelRole) return null;
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
