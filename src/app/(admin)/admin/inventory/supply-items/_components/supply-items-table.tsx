"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { type SupplyItemType } from "@/lib/types/item";
import { getSupply } from "@/lib/actions/supply";
import { getSupllyItemColumns } from "./supply-items-columns";
import { SupplyItemsTableToolbarActions } from "./supply-items-table-toolbar-actions";
import { SupplyitemsTableFloatingBar } from "./supply-items-table-floating-bar";
import { SupplyItemStatusSchema } from "prisma/generated/zod";

interface SupplyItemsTableProps {
  supplyPromise: ReturnType<typeof getSupply>;
}

export function SupplyItemsTable({ supplyPromise }: SupplyItemsTableProps) {
  const { data, pageCount, departments } = React.use(supplyPromise);

  const columns = React.useMemo(() => getSupllyItemColumns(), []);

  const filterFields: DataTableFilterField<SupplyItemType>[] = [
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
