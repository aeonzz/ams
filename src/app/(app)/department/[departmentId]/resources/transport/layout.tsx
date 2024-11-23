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
  title: "Vehicles",
};

export interface Props {
  params: {
    departmentId: string;
  };
  children: React.ReactNode;
}

export default async function CommandLayout({ children, params }: Props) {
  const department = await db.department.findUnique({
    where: {
      id: params.departmentId,
    },
    select: {
      managesTransport: true,
    },
  });

  if (!department) {
    return <NotFound />;
  }

  if (!department.managesTransport) {
    return <NotFound />;
  }

  return (
    <>
      <RoleGuard allowedRoles={["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"]}>
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
      </RoleGuard>
    </>
  );
}
