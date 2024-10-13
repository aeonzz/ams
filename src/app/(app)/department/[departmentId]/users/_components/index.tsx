import React, { useState } from "react";

import { H1, H2, H3, P } from "@/components/typography/text";
import { GetUsersSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { getDepartmentUsers } from "@/lib/actions/department";
import { DepartmentUsersTable } from "./department-users-table";
import SearchInput from "@/app/(app)/_components/search-input";

interface DepartmentUsersScreenProps {
  departmentId: string;
  search: GetUsersSchema;
}

export default function DepartmentUsersScreen({
  search,
  departmentId,
}: DepartmentUsersScreenProps) {
  const usersPromise = getDepartmentUsers({ ...search, departmentId });

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Users</P>
          <SearchInput />
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            <DepartmentUsersTable
              usersPromise={usersPromise}
              departmentId={departmentId}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
