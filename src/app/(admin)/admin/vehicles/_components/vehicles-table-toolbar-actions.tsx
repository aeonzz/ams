"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { DeleteVehiclesDialog } from "./delete-vehicles-dialog";
import type { VehicleTableType } from "./types";

interface VehiclesTableToolbarActionsProps {
  table: Table<VehicleTableType>;
}

export function VehiclesTableToolbarActions({
  table,
}: VehiclesTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteVehiclesDialog
          vehicles={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          dialogManager.setActiveDialog("adminCreateVehicleDialog")
        }
      >
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Add vehicle
      </Button>
      <Button
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
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
