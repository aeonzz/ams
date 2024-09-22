"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { VenuesTableToolbarActions } from "./venues-table-toolbar-actions";
import { getVenueStatusIcon } from "@/lib/utils";
import { VenuesTableFloatingBar } from "./venues-table-floating-bar";
import { VenueStatusSchema, VenueTypeSchema } from "prisma/generated/zod";
import { getVenues } from "@/lib/actions/venue";
import { getVenuesColumns } from "./venues-table-columns";
import type { VenueTableType } from "./types";

interface VenuesTableProps {
  venuesPromise: ReturnType<typeof getVenues>;
}

export function VenuesTable({ venuesPromise }: VenuesTableProps) {
  const { data, pageCount } = React.use(venuesPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getVenuesColumns(), []);

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
  const filterFields: DataTableFilterField<VenueTableType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Status",
      value: "status",
      options: VenueStatusSchema.options.map((venue) => ({
        label:
          venue.charAt(0).toUpperCase() +
          venue.slice(1).toLowerCase().replace(/_/g, " "),
        value: venue,
        icon: getVenueStatusIcon(venue).icon,
        withCount: true,
      })),
    },
    {
      label: "Type",
      value: "venueType",
      options: VenueTypeSchema.options.map((venue) => ({
        label:
          venue.charAt(0).toUpperCase() +
          venue.slice(1).toLowerCase().replace(/_/g, " "),
        value: venue,
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
      floatingBar={<VenuesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <VenuesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
