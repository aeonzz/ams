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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrow Request Management",
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
      managesBorrowRequest: true,
    },
  });

  if (!department) {
    return <NotFound />;
  }

  if (!department.managesBorrowRequest) {
    return <NotFound />;
  }

  return (
    <>
      <RoleGuard allowedRoles={["DEPARTMENT_HEAD"]}>
        <CommandSearchDialog>
          <ThemeDialog />
          <SettingsDialog />
          <CreateInventoryDialog
            queryKey={["department-returnable-items", params.departmentId]}
            departmentId={params.departmentId}
          />
        </CommandSearchDialog>
        <RequestOption />
        {children}
      </RoleGuard>
    </>
  );
}
