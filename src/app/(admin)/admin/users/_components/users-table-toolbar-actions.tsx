"use client";

import React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
import { Button } from "@/components/ui/button";

import CreateUserDialog from "./create-user-dialog";
import { DeleteUsersDialog } from "./delete-users-dialog";
import { type UserType } from "@/lib/types/user";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface UsersTableToolbarActionsProps {
  table: Table<UserType>;
}

export function UsersTableToolbarActions({
  table,
}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteUsersDialog
          users={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateUserDialog />
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
                filename: "Users",
                excludeColumns: ["select", "actions", "userRole"],
              })
            }
          >
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              exportTableToXLSX(table, {
                filename: "Requests",
                excludeColumns: ["select", "actions", "userRole"],
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
