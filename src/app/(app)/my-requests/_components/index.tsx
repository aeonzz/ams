import React, { useState } from "react";

import { useSession } from "@/lib/hooks/use-session";
import { ScrollArea } from "@/components/ui/scroll-area";
import { P } from "@/components/typography/text";
import { TasksTableProvider } from "@/components/providers/task-table-provider";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TasksTable } from "./task-table";
import { GetRequestsSchema } from "@/lib/schema";
import { getRequests } from "@/lib/actions/requests";

interface MyRequestScreenProps {
  search: GetRequestsSchema;
}

export default function MyRequestsScreen({ search }: MyRequestScreenProps) {
  const tasksPromise = getRequests(search);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Requests</P>
        </div>
        <div className="grid items-center py-3">
          {/**
           * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
           * Feel free to remove this, as it's not required for the `TasksTable` component to work.
           */}
          <TasksTableProvider>
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
              <TasksTable tasksPromise={tasksPromise} />
            </React.Suspense>
          </TasksTableProvider>
        </div>
      </div>
    </div>
  );
}
