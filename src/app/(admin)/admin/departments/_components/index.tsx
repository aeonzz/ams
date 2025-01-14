import React from "react";

import { P } from "@/components/typography/text";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { GetDepartmentsSchema } from "@/lib/schema";
import { getDepartments } from "@/lib/actions/department";
import { DepartmentsTable } from "./departments-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import AdminSearchInput from "../../_components/admin-search-input";

interface DepartmentScreenProps {
  params: GetDepartmentsSchema;
}

export default function DepartmentScreen({ params }: DepartmentScreenProps) {
  const departmentsPromise = getDepartments(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Departments</P>
          <AdminSearchInput />
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            <DepartmentsTable departmentsPromise={departmentsPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
