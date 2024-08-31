"use client";
"use memo";

import * as React from "react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { ModifiedDataTable } from "@/components/data-table/modified-data-table";
import { getInventoryItems } from "@/lib/actions/inventoryItem";
import { getInventoryItemsColumns } from "./inventory-items-columns";
import { type InventoryItemType } from "@/lib/types/item";
import { DataTable } from "@/components/data-table/data-table";
import { InventoryItemsTableFloatingBar } from "./inventory-items-floating-bar";
import { InventoryItemsTableToolbarActions } from "./inventory-items-table-toolbar-actions";

interface InventoryItemsTableProps {
  inventoryItemsPromise: ReturnType<typeof getInventoryItems>;
}

export function InventoryItemsTable({
  inventoryItemsPromise,
}: InventoryItemsTableProps) {
  const { data, pageCount } = React.use(inventoryItemsPromise);

  // Explicitly type the columns
  const columns = React.useMemo(() => getInventoryItemsColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<InventoryItemType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true, }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    /* */
  });

  return (
    <DataTable
      table={table}
      floatingBar={<InventoryItemsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <InventoryItemsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
