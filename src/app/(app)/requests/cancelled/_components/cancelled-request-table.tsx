"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getCancelledRequestColumns } from "./cancelled-request-table-columns";
import {
  PriorityTypeSchema,
  type Request,
  RequestStatusTypeSchema,
  RequestTypeSchema,
} from "prisma/generated/zod";
import { CancelledRequestTableToolbarActions } from "./cancelled-request-table-toolbar-actions";
import { getRequests } from "@/lib/actions/requests";
import {
  getPriorityIcon,
  getRequestTypeIcon,
} from "@/lib/utils";
import { CancelledRequestTableFloatingBar } from "./cancelled-request-table-floating-bar";
import { ModifiedDataTable } from "@/components/data-table/modified-data-table";

interface CancelledRequestsTableProps {
  requestPromise: ReturnType<typeof getRequests>;
}

export function CancelledRequestsTable({
  requestPromise,
}: CancelledRequestsTableProps) {
  const { data, pageCount } = React.use(requestPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getCancelledRequestColumns(), []);

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
    {
      label: "type",
      value: "type",
      options: RequestTypeSchema.options.map((type) => {
        const { icon } = getRequestTypeIcon(type); 

        return {
          label:
            type.charAt(0).toUpperCase() +
            type.slice(1).toLowerCase().replace(/_/g, " "),
          value: type,
          icon: icon, 
          withCount: true,
        };
      }),
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
    <ModifiedDataTable
      showSelectedRows={false}
      table={table}
      floatingBar={<CancelledRequestTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CancelledRequestTableToolbarActions table={table} />
      </DataTableToolbar>
    </ModifiedDataTable>
  );
}
