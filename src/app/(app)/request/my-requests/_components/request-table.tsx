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
  RequestTypeSchema,
} from "prisma/generated/zod";
import { RequestTableToolbarActions } from "./request-table-toolbar-actions";
import { getMyRequests } from "@/lib/actions/requests";
import {
  getPriorityIcon,
  getRequestTypeIcon,
  getStatusColor,
} from "@/lib/utils";
import { RequestTableFloatingBar } from "./request-table-floating-bar";
import { ModifiedDataTable } from "@/components/data-table/modified-data-table";
import { Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";

interface RequestTableProps {
  requestPromise: ReturnType<typeof getMyRequests>;
}

export function RequestTable({ requestPromise }: RequestTableProps) {
  const router = useRouter();
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
      options: RequestStatusTypeSchema.options
        .filter((status) => status !== "CANCELLED")
        .map((status) => ({
          label:
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase().replace(/_/g, " "),
          value: status,
          icon: Dot,
          withCount: true,
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

  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("request_update", (data: { message: string }) => {
      router.refresh();
    });

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, []);

  return (
    <ModifiedDataTable
      showSelectedRows={false}
      table={table}
      floatingBar={<RequestTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <RequestTableToolbarActions table={table} />
      </DataTableToolbar>
    </ModifiedDataTable>
  );
}
