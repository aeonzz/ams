"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentTransportRequests } from "@/lib/actions/vehicle";
import { TransportRequest } from "./types";
import { VehicleLogsTableFloatingBar } from "../[vehicleId]/logs/_components/vehicle-logs-table-floating-bar";
import { VehicleLogsTableToolbarActions } from "../[vehicleId]/logs/_components/vehicle-logs-table-toolbar-actions";
import { getTransportRequestColumns } from "./transport-request-table-columns";
import TranpsortRequestCalendar from "./transport-request-calendar";

interface TransportRequestTableProps {
  transportRequestPromise: ReturnType<typeof getDepartmentTransportRequests>;
}

export function TransportRequestTable({
  transportRequestPromise,
}: TransportRequestTableProps) {
  const { data, pageCount, department, allRequest } = React.use(
    transportRequestPromise
  );

  const columns = React.useMemo(() => getTransportRequestColumns(), []);

  const filterFields: DataTableFilterField<TransportRequest>[] = [
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

  const formattedData = allRequest?.map((request) => ({
    requestId: request.request.id,
    title: request.request.title,
    status: request.request.status,
    createdAt: request.request.createdAt,
    actualStart: request.actualStart,
    completedAt: request.request.completedAt,
  }));

  return (
    <div className="space-y-2">
      <TranpsortRequestCalendar data={formattedData} />
      <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
        <DataTable
          table={table}
          floatingBar={
            <VehicleLogsTableFloatingBar
              table={table}
              fileName={`${department?.name} Transport Requests`}
            />
          }
          className="rounded-md border py-2"
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <VehicleLogsTableToolbarActions
              table={table}
              fileName={`${department?.name} Transport Requests`}
            />
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  );
}
