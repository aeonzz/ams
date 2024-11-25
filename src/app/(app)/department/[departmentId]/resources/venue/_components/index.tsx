import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import React from "react";
import { VenueRequestTable } from "./venue-request-table";
import { getDepartmentVenueRequests } from "@/lib/actions/venue";

interface DepartmentVenueScreenProps {
  departmentId: string;
  searchParams: GetRequestsSchema;
}

export default function DepartmentVenueScreen({
  departmentId,
  searchParams,
}: DepartmentVenueScreenProps) {
  const venueRequestPromise = getDepartmentVenueRequests({
    ...searchParams,
    departmentId: departmentId,
  });

  return (
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
      <VenueRequestTable
        venueRequestPromise={venueRequestPromise}
        departmentId={departmentId}
      />
    </React.Suspense>
  );
}
