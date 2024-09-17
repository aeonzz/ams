"use client";

import { type Table } from "@tanstack/react-table";

import { Request } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface ManageRequestsTableToolbarActionsProps {
  table: Table<Request>;
}

export function ManageRequestsTableToolbarActions({
  table,
}: ManageRequestsTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return (
    <div className="flex items-center gap-2">
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
