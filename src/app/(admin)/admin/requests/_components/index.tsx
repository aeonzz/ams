import React from "react";

import { P } from "@/components/typography/text";
import { type GetRequestsSchema } from "@/lib/schema";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getRequests } from "@/lib/actions/requests";
import { RequestsTable } from "./requests-table";
import AdminSearchInput from "../../_components/admin-search-input";

interface RequestsScreenProps {
  params: GetRequestsSchema;
}

export default function RequestsScreen({ params }: RequestsScreenProps) {
  const requestsPromise = getRequests(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Requests</P>
          <AdminSearchInput />
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
            <RequestsTable requestsPromise={requestsPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
