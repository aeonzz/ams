"use client";

import { type Table } from "@tanstack/react-table";

import { Request } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface CancelledRequestTableToolbarActionsProps {
  table: Table<Request>;
}

export function CancelledRequestTableToolbarActions({
  table,
}: CancelledRequestTableToolbarActionsProps) {
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
      <Button
        variant="shine"
        size="sm"
        onClick={() => dialogManager.setActiveDialog("requestDialog")}
      >
        <CirclePlus className="mr-2 size-5" />
        Create request
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
