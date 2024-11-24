import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getDepartmentTransportRequests } from "@/lib/actions/vehicle";
import { GetRequestsSchema } from "@/lib/schema";
import React from "react";
import { TransportRequestTable } from "./transport-request-table";

interface DepartmentTransportScreenProps {
  departmentId: string;
  searchParams: GetRequestsSchema;
}

export default function DepartmentTransportScreen({
  departmentId,
  searchParams,
}: DepartmentTransportScreenProps) {
  const transportRequestPromise = getDepartmentTransportRequests({
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
      <TransportRequestTable
        transportRequestPromise={transportRequestPromise}
      />
    </React.Suspense>
  );
}
