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
import { AlertCard } from "@/components/ui/alert-card";

interface DepartmentSupplyItemsTableProps {
  supplyPromise: ReturnType<typeof getDepartmentSupply>;
}

export function DepartmentSupplyItemsTable({
  supplyPromise,
}: DepartmentSupplyItemsTableProps) {
  const { data, pageCount, departments, categories } = React.use(supplyPromise);

  const columns = React.useMemo(
    () =>
      getSupllyItemColumns({
        queryKey: ["update-department-supply-items"],
        removeField: true,
      }),
    []
  );

  const filterFields: DataTableFilterField<SupplyItemType>[] = [
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
    ...(categories
      ? [
          {
            label: "Category",
            value: "categoryName" as keyof SupplyItemType,
            options: categories.map((category) => ({
              label:
                category.name.charAt(0).toUpperCase() +
                category.name.slice(1).toLowerCase().replace(/_/g, " "),
              value: category.name,
              withCount: true,
            })),
          },
        ]
      : []),
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

  const hasLowOrNoStock = data.some(
    (item) => item.status === "LOW_STOCK" || item.status === "OUT_OF_STOCK"
  );

  return (
    <DataTable
      table={table}
      floatingBar={<SupplyitemsTableFloatingBar fileName="Supply-Items" table={table} />}
    >
      {hasLowOrNoStock && (
        <AlertCard
          variant="warning"
          title="Low Stock Alert"
          description="Some items are running low or out of stock. Please check the inventory."
        />
      )}
      <DataTableToolbar table={table} filterFields={filterFields}>
        <SupplyItemsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
