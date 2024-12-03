import React from "react";

import RequestOption from "@/app/(app)/dashboard/_components/request-option";
import CommandSearchDialog from "@/components/dialogs/command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVenueDialog from "@/app/(admin)/admin/venues/_components/create-venue-dialog";
import { RoleGuard } from "@/components/role-guard";
import { db } from "@/lib/db/index";
import NotFound from "@/app/not-found";
import CreateInventoryDialog from "@/app/(admin)/admin/inventory/lendable-items/_components/create-inventory-dialog";
import CreateSupplyItemDialog from "@/app/(admin)/admin/inventory/supply-items/_components/create-supply-item-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supply items",
};

interface Props {
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
      managesSupplyRequest: true,
    },
  });

  if (!department) {
    return <NotFound />;
  }

  if (!department.managesSupplyRequest) {
    return <NotFound />;
  }

  return (
    <>
      <RoleGuard allowedRoles={["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"]}>
        <CommandSearchDialog>
          <ThemeDialog />
          <SettingsDialog />
          <CreateSupplyItemDialog
            queryKey={["department-supply-items", params.departmentId]}
            departmentId={params.departmentId}
          />
        </CommandSearchDialog>
        <RequestOption />
        {children}
      </RoleGuard>
    </>
  );
}
