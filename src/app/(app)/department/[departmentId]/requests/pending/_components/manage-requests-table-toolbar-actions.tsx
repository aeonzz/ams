"use client";

import React from "react";
import { type Table } from "@tanstack/react-table";

import { Request } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import type { RequestTableType } from "@/lib/types/request";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";

interface ManageRequestsTableToolbarActionsProps {
  table: Table<RequestTableType>;
}

export function ManageRequestsTableToolbarActions({
  table,
}: ManageRequestsTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return (
    <div className="flex items-center gap-2">
      <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
        <DateRangePicker
          triggerVariant="secondary"
          triggerSize="sm"
          triggerClassName="ml-auto w-fit"
          align="end"
          placeholder="Created"
        />
      </React.Suspense>
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteRequestDialog
          request={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null} */}
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
