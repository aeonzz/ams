"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import type { InventorySubItemType } from "@/lib/types/item";
import { getInventorySubItems } from "@/lib/actions/inventoryItem";
import { InventorySubItemsTableFloatingBar } from "@/app/(admin)/admin/inventory/lendable-items/[inventoryId]/_components/inventory-sub-items-table-floating-bar";
import { InventorySubItemsTableToolbarActions } from "@/app/(admin)/admin/inventory/lendable-items/[inventoryId]/_components/inventory-sub-items-table-toolbar-actions";
import { getInventorySubItemsColumns } from "./inventory-sub-items-columns";

interface InventorySubItemsTableProps {
  inventorySubItemsPromise: ReturnType<typeof getInventorySubItems>;
  departmentId: string;
  inventoryId: string;
}

export function InventorySubItemsTable({
  inventorySubItemsPromise,
  departmentId,
  inventoryId,
}: InventorySubItemsTableProps) {
  const { data, pageCount, item } = React.use(inventorySubItemsPromise);

  const columns = React.useMemo(
    () =>
      getInventorySubItemsColumns(
        `/department/${departmentId}/resources/borrow-request-management/items/${inventoryId}`
      ),
    []
  );

  const filterFields: DataTableFilterField<InventorySubItemType>[] = [
    {
      label: "Name",
      value: "subName",
      placeholder: "Filter name...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <DataTable
      table={table}
      floatingBar={
        <InventorySubItemsTableFloatingBar
          fileName={`${item?.name}-Sub-items`}
          table={table}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <InventorySubItemsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
