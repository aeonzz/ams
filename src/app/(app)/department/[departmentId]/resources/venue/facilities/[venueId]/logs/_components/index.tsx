import React from "react";

import { P } from "@/components/typography/text";
import { type GetVehicleSchema } from "@/lib/schema";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { VenueLogsTable } from "./venue-logs-table";
import { getRequestByVenueId } from "@/lib/actions/venue";

interface VenueLogsScreenProps {
  params: {
    venueId: string;
  };
  searchParams: GetVehicleSchema;
}

export default function VenueLogsScreen({
  params,
  searchParams,
}: VenueLogsScreenProps) {
  const venueRequestsPromise = getRequestByVenueId({
    ...searchParams,
    venueId: params.venueId,
  });

  return (
    <div className="flex h-full w-full">
      <div className="grid h-auto place-items-center items-center py-3">
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
          <VenueLogsTable venueRequestsPromise={venueRequestsPromise} />
        </React.Suspense>
      </div>
    </div>
  );
}
