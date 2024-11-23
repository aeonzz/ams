"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getVehicleLogsColumns } from "./vehicle-logs-table-columns";
import { VehicleLogsTableFloatingBar } from "./vehicle-logs-table-floating-bar";
import { VehicleLogsTableToolbarActions } from "./vehicle-logs-table-toolbar-actions";
import { getVehicleMaintenanceRecord } from "@/lib/actions/maintenance-history";
import type { MaintenanceHistory } from "prisma/generated/zod";

interface VehicleMaintenanceRecordTableProps {
  vehicleMaintenancePromise: ReturnType<typeof getVehicleMaintenanceRecord>;
}

export function VehicleMaintenanceRecordTable({
  vehicleMaintenancePromise,
}: VehicleMaintenanceRecordTableProps) {
  const { data, pageCount, vehicle } = React.use(vehicleMaintenancePromise);

  const columns = React.useMemo(() => getVehicleLogsColumns(), []);

//   const filterFields: DataTableFilterField<MaintenanceHistory>[] = [
//     {
//       label: "Name",
//       value: "title",
//       placeholder: "Filter title...",
//     },
//   ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
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
