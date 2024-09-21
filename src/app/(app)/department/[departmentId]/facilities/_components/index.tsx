import React, { useState } from "react";

import { H1, H2, H3, P } from "@/components/typography/text";
import { type GetVenuesSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { getVenues } from "@/lib/actions/venue";
import { ManageVenuesTable } from "./manage-venue-table";

interface ManageVenueScreenProps {
  params: GetVenuesSchema;
}

export default function ManageVenueScreen({ params }: ManageVenueScreenProps) {
  const venuesPromise = getVenues(params);

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
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            {/* <ManageVenuesTable venuesPromise={usersPromise} /> */}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
