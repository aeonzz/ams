"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import {
  PriorityTypeSchema,
  Request,
  RequestStatusTypeSchema,
  RequestTypeSchema,
} from "prisma/generated/zod";
import { getManageRequests } from "@/lib/actions/requests";
import {
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusColor,
} from "@/lib/utils";
import { ModifiedDataTable } from "@/components/data-table/modified-data-table";
import { Dot } from "lucide-react";
import { getManageRequestsColumns } from "./manage-request-table-columns";
import { ManageRequestsTableToolbarActions } from "./manage-requests-table-toolbar-actions";
import { ManageRequestsTableFloatingBar } from "./manage-requests-table-floating-bar";
import type { RequestTableType } from "@/lib/types/request";

interface ManageRequestsTableProps {
  requestPromise: ReturnType<typeof getManageRequests>;
}

export function ManageRequestsTable({
  requestPromise,
}: ManageRequestsTableProps) {
  const { data, pageCount } = React.use(requestPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getManageRequestsColumns(), []);

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
  const filterFields: DataTableFilterField<RequestTableType>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
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
    <ModifiedDataTable
      showSelectedRows={false}
      table={table}
      floatingBar={<ManageRequestsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ManageRequestsTableToolbarActions table={table} />
      </DataTableToolbar>
    </ModifiedDataTable>
  );
}
