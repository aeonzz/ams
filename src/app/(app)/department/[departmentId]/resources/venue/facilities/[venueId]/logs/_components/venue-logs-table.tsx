"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequestByVenueId } from "@/lib/actions/venue";
import { DepartmentVenueRequest } from "../../../../_components/types";
import { VenueRequestTableFloatingBar } from "../../../../_components/venue-request-table-floating-bar";
import { VenueRequestTableToolbarActions } from "../../../../_components/venue-request-table-toolbar-actions";
import { getVenueLogsColumns } from "./venue-logs-table-columns";

interface VenueLogsTableProps {
  venueRequestsPromise: ReturnType<typeof getRequestByVenueId>;
}

export function VenueLogsTable({ venueRequestsPromise }: VenueLogsTableProps) {
  const { data, pageCount, venue } = React.use(venueRequestsPromise);

  const columns = React.useMemo(() => getVenueLogsColumns(), []);

  const filterFields: DataTableFilterField<DepartmentVenueRequest>[] = [
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
        <VenueRequestTableFloatingBar
          table={table}
          fileName={`${venue?.name} - Requests`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VenueRequestTableToolbarActions
          table={table}
          fileName={`${venue?.name} - Requests`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
