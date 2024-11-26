import React from "react";
import { db } from "@/lib/db/index";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVehicleDialog from "@/app/(admin)/admin/vehicles/_components/create-vehicle-dialog";
import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import NotFound from "@/app/not-found";
import { RoleGuard } from "@/components/role-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Request",
};

export interface Props {
  children: React.ReactNode;
}

export default async function CommandLayout({ children }: Props) {
  return (
    <>
      <RoleGuard
        allowedRoles={["DEPARTMENT_HEAD", "OPERATIONS_MANAGER", "PERSONNEL"]}
      >
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
