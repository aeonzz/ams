"use client";

import React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { DeleteDepartmentsDialog } from "./delete-departments-dialog";
import CreateDepartmentDialog from "./create-department-dialog";
import type { DepartmentsTableType } from "./types";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface DepartmentsTableToolbarActionsProps {
  table: Table<DepartmentsTableType>;
}

export function DepartmentsTableToolbarActions({
  table,
}: DepartmentsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteDepartmentsDialog
          departments={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateDepartmentDialog />
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
                filename: "Departments",
                excludeColumns: ["select", "actions", "users"],
              })
            }
          >
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              exportTableToXLSX(table, {
                filename: "Departments",
                excludeColumns: ["select", "actions", "users"],
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
