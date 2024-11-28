"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getInventory } from "@/lib/actions/inventory";
import { getInventoryColumns } from "./inventory-table-columns";
import { type InventoryItemType } from "@/lib/types/item";
import { InventoryTableFloatingBar } from "./inventory-table-floating-bar";
import { InventoryTableToolbarActions } from "./inventory-table-toolbar-actions";
import SubItemsTable from "./sub-items-table";

interface InventoryTableProps {
  inventoryPromise: ReturnType<typeof getInventory>;
}

export function InventoryTable({ inventoryPromise }: InventoryTableProps) {
  const { data, pageCount, departments } = React.use(inventoryPromise);

  const columns = React.useMemo(() => getInventoryColumns(), []);

  const filterFields: DataTableFilterField<InventoryItemType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Department",
      value: "departmentName",
      options: departments?.map((department) => ({
        label:
          department.name.charAt(0).toUpperCase() +
          department.name.slice(1).toLowerCase().replace(/_/g, " "),
        value: department.name,
        withCount: true,
      })),
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
      floatingBar={<InventoryTableFloatingBar fileName="Lendable-Items" table={table} />}
      renderSubComponent={({ row }) => (
        <SubItemsTable
          subItems={row.original.inventorySubItems}
          inventoryId={row.original.id}
        />
      )}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <InventoryTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
