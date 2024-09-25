"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { VehiclesTableToolbarActions } from "./vehicles-table-toolbar-actions";
import { VehicleStatusSchema } from "prisma/generated/zod";
import { getVehiclesColumns } from "./vehicles-table-columns";
import { getVehicles } from "@/lib/actions/vehicle";
import { VehiclesTableFloatingBar } from "./vehicles-table-floating-bar";
import type { VehicleTableType } from "./types";

interface VehiclesTableProps {
  vehiclesPromise: ReturnType<typeof getVehicles>;
}

export function VehiclesTable({ vehiclesPromise }: VehiclesTableProps) {
  const { data, pageCount } = React.use(vehiclesPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getVehiclesColumns(), []);

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
  const filterFields: DataTableFilterField<VehicleTableType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Status",
      value: "status",
      options: VehicleStatusSchema.options.map((vehicle) => ({
        label:
          vehicle.charAt(0).toUpperCase() +
          vehicle.slice(1).toLowerCase().replace(/_/g, " "),
        value: vehicle,
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
      floatingBar={<VehiclesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VehiclesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
