import React from "react";

import { P } from "@/components/typography/text";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import { getDepartmentBorrowableRequests } from "@/lib/actions/inventory";
import { BorrowableRequestTable } from "./borrowable-request-table";

interface DepartmentBorrowableItemsRequestsScreenProps {
  departmentId: string;
  searchParams: GetRequestsSchema;
}

export default function DepartmentBorrowableItemsRequestsScreen({
  departmentId,
  searchParams,
}: DepartmentBorrowableItemsRequestsScreenProps) {
  const borrowableRequestPromise = getDepartmentBorrowableRequests({
    ...searchParams,
    departmentId: departmentId,
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
          <BorrowableRequestTable
            borrowableRequestPromise={borrowableRequestPromise}
            departmentId={departmentId}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
