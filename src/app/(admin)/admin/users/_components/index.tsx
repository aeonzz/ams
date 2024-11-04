import React, { useState } from "react";

import { H1, H2, H3, P } from "@/components/typography/text";
import { GetUsersSchema } from "@/lib/schema";
import { getUsers } from "@/lib/actions/users";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { UsersTable } from "./users-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import AdminSearchInput from "../../_components/admin-search-input";

interface UsersScreenProps {
  params: GetUsersSchema;
}

export default function UsersScreen({ params }: UsersScreenProps) {
  const usersPromise = getUsers(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Users</P>
          {/**
           * The `DateRangePicker` component is used to render the date range picker UI.
           * It is used to filter the tasks based on the selected date range it was created at.
           * The business logic for filtering the tasks based on the selected date range is handled inside the component.
           */}
          {/* <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense> */}
          <AdminSearchInput />
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            {/**
             * Passing promises and consuming them using React.use for triggering the suspense fallback.
             * @see https://react.dev/reference/react/use
             */}
            <UsersTable usersPromise={usersPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
