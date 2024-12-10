"use client";

import React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import type { InventorySubItemType } from "@/lib/types/item";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { DeleteInventorySubItemsDialog } from "./delete-inventory-sub-items-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventorySubItemsTableToolbarActionsProps {
  table: Table<InventorySubItemType>;
  fileName: string;
}

export function InventorySubItemsTableToolbarActions({
  table,
  fileName,
}: InventorySubItemsTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteInventorySubItemsDialog
          items={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          dialogManager.setActiveDialog("adminCreateInventorySubItemDialog")
        }
      >
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Add
      </Button>
      <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
        <DateRangePicker
          triggerVariant="secondary"
          triggerSize="sm"
          triggerClassName="ml-auto w-fit"
          placeholder="Created"
        />
      </React.Suspense>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
            Export
            <ChevronDownIcon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onClick={() =>
              exportTableToCSV(table, {
                filename: fileName,
                excludeColumns: ["select", "actions"],
              })
            }
          >
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              exportTableToXLSX(table, {
                filename: fileName,
                excludeColumns: ["select", "actions"],
              })
            }
          >
            Export to Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
