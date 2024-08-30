import React, { useState } from "react";

import { H1, H2, H3, P } from "@/components/typography/text";
import { type GetEquipmentSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getEquipments } from "@/lib/actions/item";
import { EquipmentsTable } from "./equipments-table";

interface EquipmentsScreenProps {
  params: GetEquipmentSchema;
}

export default function EquipmentsScreen({ params }: EquipmentsScreenProps) {
  const equipmentsPromise = getEquipments(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Users</P>
          {/**
           * The `DateRangePicker` component is used to render the date range picker UI.
           * It is used to filter the tasks based on the selected date range it was created at.
           * The business logic for filtering the tasks based on the selected date range is handled inside the component.
           */}
          <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense>
        </div>
        <div className="grid items-center py-3">
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={5}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          >
            {/**
             * Passing promises and consuming them using React.use for triggering the suspense fallback.
             * @see https://react.dev/reference/react/use
             */}
            <EquipmentsTable equipmentsPromise={equipmentsPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
