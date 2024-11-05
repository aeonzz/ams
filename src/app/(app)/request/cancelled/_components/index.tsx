import React from "react";

import { P } from "@/components/typography/text";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { type GetRequestsSchema } from "@/lib/schema";
import { CancelledRequestsTable } from "./cancelled-request-table";
import { getCancelledRequests } from "@/lib/actions/requests";
interface CanceledRequestsScreenProps {
  search: GetRequestsSchema;
}

export default function CanceledRequestsScreen({
  search,
}: CanceledRequestsScreenProps) {
  const tasksPromise = getCancelledRequests(search);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Cancelled Requests</P>
          <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense>
        </div>
        <div className="grid items-center py-3">
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={5}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          >
            {/**
             * Passing promises and consuming them using React.use for triggering the suspense fallback.
             * @see https://react.dev/reference/react/use
             */}
            <CancelledRequestsTable requestPromise={tasksPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
