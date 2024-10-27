"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { type SupplyItemType } from "@/lib/types/item";
import { getDepartmentSupply } from "@/lib/actions/supply";
import { SupplyItemStatusSchema } from "prisma/generated/zod";
import { SupplyitemsTableFloatingBar } from "@/app/(admin)/admin/inventory/supply-items/_components/supply-items-table-floating-bar";
import { SupplyItemsTableToolbarActions } from "@/app/(admin)/admin/inventory/supply-items/_components/supply-items-table-toolbar-actions";
import { getSupllyItemColumns } from "@/app/(admin)/admin/inventory/supply-items/_components/supply-items-columns";

interface DepartmentSupplyItemsTableProps {
  supplyPromise: ReturnType<typeof getDepartmentSupply>;
}

export function DepartmentSupplyItemsTable({
  supplyPromise,
}: DepartmentSupplyItemsTableProps) {
  const { data, pageCount, departments } = React.use(supplyPromise);

  const columns = React.useMemo(() => getSupllyItemColumns(), []);

  const filterFields: DataTableFilterField<
    Omit<SupplyItemType, "departmentName">
  >[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Status",
      value: "status",
      options: SupplyItemStatusSchema.options.map((status) => ({
        label:
          status.charAt(0).toUpperCase() +
          status.slice(1).toLowerCase().replace(/_/g, " "),
        value: status,
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
      floatingBar={<SupplyitemsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <SupplyItemsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
