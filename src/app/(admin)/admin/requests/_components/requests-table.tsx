"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequests } from "@/lib/actions/requests";
import { getRequestsColumns } from "./requests-table-columns";
import { type InventoryItemType } from "@/lib/types/item";
import { RequestsTableFloatingBar } from "./requests-table-floating-bar";
import { RequestsTableToolbarActions } from "./requests-table-toolbar-actions";
import { RequestsTableType } from "./types";
import { RequestStatusTypeSchema, RequestTypeSchema } from "prisma/generated/zod";
import { Dot } from "lucide-react";
import { getRequestTypeIcon } from "@/lib/utils";

interface RequestsTableProps {
  requestsPromise: ReturnType<typeof getRequests>;
}

export function RequestsTable({ requestsPromise }: RequestsTableProps) {
  const { data, pageCount, departments } = React.use(requestsPromise);

  const columns = React.useMemo(() => getRequestsColumns(), []);

  const filterFields: DataTableFilterField<RequestsTableType>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
    },
    {
      label: "Department",
      value: "departmentName",
      options: departments?.map((department) => ({
        label:
          department.name.charAt(0).toUpperCase() +
          department.name.slice(1).toLowerCase().replace(/_/g, " "),
        value: department.name,
      })),
    },
    {
      label: "Status",
      value: "status",
      options: RequestStatusTypeSchema.options.map((status) => ({
          label:
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase().replace(/_/g, " "),
          value: status,
          icon: Dot,
        })),
    },
    {
      label: "Type",
      value: "type",
      options: RequestTypeSchema.options.map((type) => ({
        label:
          type.charAt(0).toUpperCase() +
          type.slice(1).toLowerCase().replace(/_/g, " "),
        value: type,
        icon: getRequestTypeIcon(type).icon,
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
      floatingBar={<RequestsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <RequestsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
