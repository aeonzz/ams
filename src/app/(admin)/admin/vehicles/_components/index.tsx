import React from "react";

import { P } from "@/components/typography/text";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { type GetVehicleSchema } from "@/lib/schema";
import { getVehicles } from "@/lib/actions/vehicle";
import { VehiclesTable } from "./vehicles-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import AdminSearchInput from "../../_components/admin-search-input";

interface VehiclesScreenProps {
  params: GetVehicleSchema;
}

export default function VehiclesScreen({ params }: VehiclesScreenProps) {
  const vehiclesPromise = getVehicles(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Vehicles</P>
          {/**
           * The `DateRangePicker` component is used to render the date range picker UI.
           * It is used to filter the tasks based on the selected date range it was created at.
           * The business logic for filtering the tasks based on the selected date range is handled inside the component.
           */}
          <AdminSearchInput />
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            {/**
             * Passing promises and consuming them using React.use for triggering the suspense fallback.
             * @see https://react.dev/reference/react/use
             */}
            <VehiclesTable vehiclesPromise={vehiclesPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
