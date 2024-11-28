"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import type { InventorySubItemType } from "@/lib/types/item";
import { getInventorySubItems } from "@/lib/actions/inventoryItem";
import { getInventorySubItemsColumns } from "./inventory-sub-items-columns";
import { InventorySubItemsTableFloatingBar } from "./inventory-sub-items-table-floating-bar";
import { InventorySubItemsTableToolbarActions } from "./inventory-sub-items-table-toolbar-actions";

interface InventorySubItemsTableProps {
  inventorySubItemsPromise: ReturnType<typeof getInventorySubItems>;
}

export function InventorySubItemsTable({
  inventorySubItemsPromise,
}: InventorySubItemsTableProps) {
  const { data, pageCount, item } = React.use(inventorySubItemsPromise);

  const columns = React.useMemo(() => getInventorySubItemsColumns(), []);

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
          fileName={`${item?.name}-Sub-Items`}
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
