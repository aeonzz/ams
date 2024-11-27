"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getDepartmentTransportRequests } from "@/lib/actions/vehicle";
import { TransportRequest } from "./types";
import { TransportRequestTableFloatingBar } from "./transport-request-table-floating-bar";
import { TransportRequestTableToolbarActions } from "./transport-request-table-toolbar-actions";
import { getTransportRequestColumns } from "./transport-request-table-columns";
import TranpsortRequestCalendar from "./transport-request-calendar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";

interface TransportRequestTableProps {
  transportRequestPromise: ReturnType<typeof getDepartmentTransportRequests>;
  departmentId: string;
}

export function TransportRequestTable({
  transportRequestPromise,
  departmentId,
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
    dateAndTimeNeeded: request.dateAndTimeNeeded,
  }));

  return (
    <div className="space-y-2">
      <TranpsortRequestCalendar data={formattedData} />
      <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
        <DataTable
          table={table}
          floatingBar={
            <TransportRequestTableFloatingBar
              table={table}
              fileName={`${department?.name} Transport Requests`}
            />
          }
          className="rounded-md border py-2"
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <TransportRequestTableToolbarActions
              table={table}
              fileName={`${department?.name} Transport Requests`}
            >
              <Link
                prefetch
                className={cn(
                  buttonVariants({ variant: "ghost2", size: "sm" })
                )}
                href={`/department/${departmentId}/resources/transport/vehicles`}
              >
                <P>Vehicles</P>
              </Link>
            </TransportRequestTableToolbarActions>
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  );
}
