import React from "react";

import { P } from "@/components/typography/text";
import { type GetVehicleSchema } from "@/lib/schema";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getRequestByVehicleId } from "@/lib/actions/vehicle";
import { VehicleLogsTable } from "./vehicle-logs-table";
import SearchInput from "@/app/(app)/_components/search-input";
import BackButton from "@/components/back-button";

interface VehicleLogsScreenProps {
  params: {
    vehicleId: string;
  };
  searchParams: GetVehicleSchema;
}

export default function VehicleLogsScreen({
  params,
  searchParams,
}: VehicleLogsScreenProps) {
  const vehicleRequestsPromise = getRequestByVehicleId({
    ...searchParams,
    vehicleId: params.vehicleId,
  });

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={4}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          >
            <VehicleLogsTable vehicleRequestsPromise={vehicleRequestsPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
