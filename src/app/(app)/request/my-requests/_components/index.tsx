import React from "react";

import { P } from "@/components/typography/text";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetRequestsSchema } from "@/lib/schema";
import { getMyRequests } from "@/lib/actions/requests";
import { RequestTable } from "./request-table";
import SearchInput from "@/app/(app)/_components/search-input";
import MenuSheet from "@/app/(app)/dashboard/_components/menu-sheet";
import MobileMenu from "@/components/mobile-menu";
interface MyRequestScreenProps {
  search: GetRequestsSchema;
}

export default function MyRequestsScreen({ search }: MyRequestScreenProps) {
  const tasksPromise = getMyRequests(search);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <div className="flex items-center gap-1">
            <MobileMenu>
              <P className="font-medium">My Requests</P>
            </MobileMenu>
          </div>
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
