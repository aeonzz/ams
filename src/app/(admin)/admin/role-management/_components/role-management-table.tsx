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
import { getRoles } from "@/lib/actions/role";

interface RoleManagementTableProps {
  roleManagementPromise: ReturnType<typeof getRoles>;
}

export function RoleManagementTable({ roleManagementPromise }: RoleManagementTableProps) {
  const { data, pageCount } = React.use(roleManagementPromise);

  const columns = React.useMemo(() => getInventoryColumns(), []);

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
      floatingBar={<InventoryTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <InventoryTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
