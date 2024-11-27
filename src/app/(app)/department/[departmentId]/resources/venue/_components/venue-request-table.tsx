"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import VenueRequestCalendar from "./venue-request-calendar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { getDepartmentVenueRequests } from "@/lib/actions/venue";
import { getVenueRequestColumns } from "./venue-request-table-columns";
import { DepartmentVenueRequest } from "./types";
import { VenueRequestTableFloatingBar } from "./venue-request-table-floating-bar";
import { VenueRequestTableToolbarActions } from "./venue-request-table-toolbar-actions";

interface VenueRequestTableProps {
  venueRequestPromise: ReturnType<typeof getDepartmentVenueRequests>;
  departmentId: string;
}

export function VenueRequestTable({
  venueRequestPromise,
  departmentId,
}: VenueRequestTableProps) {
  const { data, pageCount, department, allRequest } =
    React.use(venueRequestPromise);

  const columns = React.useMemo(() => getVenueRequestColumns(), []);

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

  const formattedData = allRequest?.map((request) => ({
    requestId: request.request.id,
    title: request.request.title,
    status: request.request.status,
    createdAt: request.request.createdAt,
    startTime: request.startTime,
    endTime: request.endTime,
    actualStart: request.actualStart,
    completedAt: request.request.completedAt,
  }));

  return (
    <div className="space-y-2">
      <VenueRequestCalendar data={formattedData} />
      <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
        <DataTable
          table={table}
          floatingBar={
            <VenueRequestTableFloatingBar
              table={table}
              fileName={`${department?.name} Transport Requests`}
            />
          }
          className="rounded-md border py-2"
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <VenueRequestTableToolbarActions
              table={table}
              fileName={`${department?.name} Transport Requests`}
            >
              <Link
                prefetch
                className={cn(
                  buttonVariants({ variant: "ghost2", size: "sm" })
                )}
                href={`/department/${departmentId}/resources/venue/facilities`}
              >
                <P>Facilities</P>
              </Link>
            </VenueRequestTableToolbarActions>
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  );
}
