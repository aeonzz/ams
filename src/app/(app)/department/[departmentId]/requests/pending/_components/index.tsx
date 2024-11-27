import React from "react";

import { P } from "@/components/typography/text";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import { getManageRequests } from "@/lib/actions/requests";
import { ManageRequestsTable } from "./manage-requests-table";
import SearchInput from "@/app/(app)/_components/search-input";

interface ManageRequestScreenProps {
  departmentId: string;
  search: GetRequestsSchema;
}

export default function ManageRequestScreen({
  departmentId,
  search,
}: ManageRequestScreenProps) {
  const requestPromise = getManageRequests({ ...search, departmentId });

  return (
    <div className="w-full py-2">
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
        <ManageRequestsTable requestPromise={requestPromise} />
      </React.Suspense>
    </div>
  );
}
