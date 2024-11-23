import React from "react";

import { P } from "@/components/typography/text";
import { type GetVehicleMaintenanceHistory } from "@/lib/schema";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getVehicleMaintenanceRecord } from "@/lib/actions/maintenance-history";
import SearchInput from "@/app/(app)/_components/search-input";
import { VehicleMaintenanceRecordTable } from "./vehicle-maintenance-record-table";

interface VehicleMaintenanceScreenProps {
  params: {
    vehicleId: string;
  };
  searchParams: GetVehicleMaintenanceHistory;
}

export default function VehicleMaintenanceScreen({
  params,
  searchParams,
}: VehicleMaintenanceScreenProps) {
  const vehicleMaintenancePromise = getVehicleMaintenanceRecord({
    ...searchParams,
    vehicleId: params.vehicleId,
  });

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Vehicle Maintenance History</P>
          <SearchInput />
        </div>
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
            <VehicleMaintenanceRecordTable vehicleMaintenancePromise={vehicleMaintenancePromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
