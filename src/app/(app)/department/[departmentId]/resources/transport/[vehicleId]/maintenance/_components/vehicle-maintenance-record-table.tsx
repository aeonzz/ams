"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { getVehicleMaintenanceRecord } from "@/lib/actions/maintenance-history";
import { getMaintenanceRecordColumns } from "./vehicle-maintenance-record-table-columns";
import { VehicleMaintenanceRecordTableFloatingBar } from "./vehicle-maintenance-record-table-floating-bar";
import { MaintenanceHistory } from "prisma/generated/zod";
import { DataTableFilterField } from "@/lib/types";
import { VehicleMaintenanceRecordTableToolbarActions } from "./vehicle-maintenance-record-table-toolbar-actions";

interface VehicleMaintenanceRecordTableProps {
  vehicleMaintenancePromise: ReturnType<typeof getVehicleMaintenanceRecord>;
}

export function VehicleMaintenanceRecordTable({
  vehicleMaintenancePromise,
}: VehicleMaintenanceRecordTableProps) {
  const { data, pageCount, vehicle } = React.use(vehicleMaintenancePromise);

  const columns = React.useMemo(() => getMaintenanceRecordColumns(), []);

  const filterFields: DataTableFilterField<MaintenanceHistory>[] = [
    {
      label: "Description",
      value: "description",
      placeholder: "Filter description...",
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
        <VehicleMaintenanceRecordTableFloatingBar
          table={table}
          fileName={`${vehicle?.name} - Maintenance_Logs`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VehicleMaintenanceRecordTableToolbarActions
          table={table}
          fileName={`${vehicle?.name} - Maintenance_Logs`}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
