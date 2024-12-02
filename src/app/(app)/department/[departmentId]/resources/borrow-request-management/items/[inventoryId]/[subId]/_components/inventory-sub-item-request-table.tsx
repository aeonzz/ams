"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequestByItemId } from "@/lib/actions/inventoryItem";
import { DepartmentBorrowableRequest } from "../../../../_components/types";
import { BorrowableRequestTableFloatingBar } from "../../../../_components/borrowable-request-table-floating-bar";
import { BorrowableRequestTableToolbarActions } from "../../../../_components/borrowable-request-table-toolbar-actions";
import { getInventorySubItemRequestColumns } from "./inventory-sub-item-request-table-columns";

interface InventorySubItemRequestTableProps {
  itemRequestPromise: ReturnType<typeof getRequestByItemId>;
}

export function InventorySubItemRequestTable({
  itemRequestPromise,
}: InventorySubItemRequestTableProps) {
  const { data, pageCount, item } = React.use(itemRequestPromise);

  const columns = React.useMemo(() => getInventorySubItemRequestColumns(), []);

  const filterFields: DataTableFilterField<DepartmentBorrowableRequest>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter title...",
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
        <BorrowableRequestTableFloatingBar
          table={table}
          fileName={`${item?.subName} Borrow Requests`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <BorrowableRequestTableToolbarActions
          table={table}
          fileName={`${item?.subName} Borrow Requests`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
