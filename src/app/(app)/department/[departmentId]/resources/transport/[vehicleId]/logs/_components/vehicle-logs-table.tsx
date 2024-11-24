"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRequestByVehicleId } from "@/lib/actions/vehicle";
import { getVehicleLogsColumns } from "./vehicle-logs-table-columns";
import { TransportRequest } from "../../../_components/types";
import { VehicleLogsTableFloatingBar } from "./vehicle-logs-table-floating-bar";
import { VehicleLogsTableToolbarActions } from "./vehicle-logs-table-toolbar-actions";

interface VehicleLogsTableProps {
  vehicleRequestsPromise: ReturnType<typeof getRequestByVehicleId>;
}

export function VehicleLogsTable({
  vehicleRequestsPromise,
}: VehicleLogsTableProps) {
  const { data, pageCount, vehicle } = React.use(vehicleRequestsPromise);

  const columns = React.useMemo(() => getVehicleLogsColumns(), []);

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

  return (
    <DataTable
      table={table}
      floatingBar={
        <VehicleLogsTableFloatingBar
          table={table}
          fileName={`${vehicle?.name} - Requests`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VehicleLogsTableToolbarActions
          table={table}
          fileName={`${vehicle?.name} - Requests`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
