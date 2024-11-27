import React from "react";

import { GetUsersSchema } from "@/lib/schema";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { getDepartmentUsers } from "@/lib/actions/department";
import { DepartmentUsersTable } from "./department-users-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

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
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            searchableColumnCount={1}
            filterableColumnCount={0}
            cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
            shrinkZero
          />
        }
      >
        <DepartmentUsersTable
          usersPromise={usersPromise}
          departmentId={departmentId}
        />
      </React.Suspense>
    </div>
  );
}
