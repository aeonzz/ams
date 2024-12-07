import React from "react";

import { P } from "@/components/typography/text";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { type GetRequestsSchema } from "@/lib/schema";
import { CancelledRequestsTable } from "./cancelled-request-table";
import { getCancelledRequests } from "@/lib/actions/requests";
import SearchInput from "@/app/(app)/_components/search-input";
import MobileMenu from "@/components/mobile-menu";
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
          <div className="flex items-center gap-1">
            <MobileMenu>
              <P className="font-medium">Cancelled Requests</P>
            </MobileMenu>
          </div>
          <SearchInput />
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
