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
import OverviewNavigationMenu from "../../_components/navigation-menu";

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
    <div className="w-full">
      <React.Suspense fallback={<LoadingSpinner />}>
        <DepartmentUsersTable
          usersPromise={usersPromise}
          departmentId={departmentId}
        />
      </React.Suspense>
    </div>
  );
}
