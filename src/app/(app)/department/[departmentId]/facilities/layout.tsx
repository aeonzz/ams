import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVenueDialog from "@/app/(admin)/admin/venues/_components/create-venue-dialog";

export interface Props {
  params: {
    departmentId: string;
  };
  children: React.ReactNode;
}

export default function CommandLayout({ children, params }: Props) {
  return (
    <>
      <CommandSearchDialog>
        <ThemeDialog />
        <SettingsDialog />
        <CreateVenueDialog
          queryKey={["department-venues", params.departmentId]}
          departmentId={params.departmentId}
        />
      </CommandSearchDialog>
      <RequestOption />
      {children}
    </>
  );
}
