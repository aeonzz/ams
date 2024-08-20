"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequestColumns } from "./request-table-columns";
import {
  PriorityTypeSchema,
  Request,
  RequestStatusTypeSchema,
} from "prisma/generated/zod";
import { RequestTableToolbarActions } from "./request-table-toolbar-actions";
import { getRequests } from "@/lib/actions/requests";
import { getPriorityIcon, getStatusIcon } from "@/lib/utils";
import { RequestTableFloatingBar } from "./request-table-floating-bar";

interface RequestTableProps {
  requestPromise: ReturnType<typeof getRequests>;
}

export function RequestTable({ requestPromise }: RequestTableProps) {
  const { data, pageCount } = React.use(requestPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getRequestColumns(), []);

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
  const filterFields: DataTableFilterField<Request>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
    },
    {
      label: "Status",
      value: "status",
      options: RequestStatusTypeSchema.options.map((status) => ({
        label:
          status.charAt(0).toUpperCase() +
          status.slice(1).toLowerCase().replace(/_/g, " "),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Priority",
      value: "priority",
      options: PriorityTypeSchema.options.map((priority) => ({
        label:
          priority.charAt(0).toUpperCase() +
          priority.slice(1).toLowerCase().replace(/_/g, " "),
        value: priority,
        icon: getPriorityIcon(priority),
        withCount: true,
      })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    /* */
  });

  return (
    <DataTable
      table={table}
      floatingBar={<RequestTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <RequestTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
