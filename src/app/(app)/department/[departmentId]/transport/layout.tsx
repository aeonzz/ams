import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVehicleDialog from "@/app/(admin)/admin/vehicles/_components/create-vehicle-dialog";

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
        <CreateVehicleDialog
          queryKey={["department-vehicles", params.departmentId]}
          departmentId={params.departmentId}
        />
      </CommandSearchDialog>
      <RequestOption />
      {children}
    </>
  );
}
