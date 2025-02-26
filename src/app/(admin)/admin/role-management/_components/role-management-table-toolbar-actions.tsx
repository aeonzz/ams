"use client";

import React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { PlusIcon } from "lucide-react";
import { type InventoryItemType } from "@/lib/types/item";
import type { RoleType } from "@/lib/types/role";
import { DeleteRolesDialog } from "./delete-roles-dialog";
import type { RoleTableType } from "./types";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleManagementTableToolbarActionsProps {
  table: Table<RoleTableType>;
}

export function RoleManagementTableToolbarActions({
  table,
}: RoleManagementTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteRolesDialog
          roles={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {/* <Button
        variant="secondary"
        size="sm"
        onClick={() => dialogManager.setActiveDialog("adminCreateRoleDialog")}
      >
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Add role
      </Button> */}
      {/* <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          dialogManager.setActiveDialog("adminCreateUserRoleDialog")
        }
      >
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Create user role
      </Button> */}
      {/* <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
        <DateRangePicker
          triggerVariant="secondary"
          triggerSize="sm"
          triggerClassName="ml-auto w-fit"
          placeholder="Created"
        />
      </React.Suspense> */}
      {/* <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button> */}
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
