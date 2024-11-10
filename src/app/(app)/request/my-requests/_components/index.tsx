import React from "react";

import { P } from "@/components/typography/text";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import { getMyRequests } from "@/lib/actions/requests";
import { RequestTable } from "./request-table";
import SearchInput from "@/app/(app)/_components/search-input";
interface MyRequestScreenProps {
  search: GetRequestsSchema;
}

export default function MyRequestsScreen({ search }: MyRequestScreenProps) {
  const tasksPromise = getMyRequests(search);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">My Requests</P>
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
            <RequestTable requestPromise={tasksPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
