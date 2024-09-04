import React from "react";

import { P } from "@/components/typography/text";
import { type GetRoleManagementSchema } from "@/lib/schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { getRoles } from "@/lib/actions/role";
import { RoleManagementTable } from "./role-management-table";

interface RoleManagementScreenProps {
  params: GetRoleManagementSchema;
}

export default function RoleManagementScreen({ params }: RoleManagementScreenProps) {
  const roleManagementPromise = getRoles(params);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          <P className="font-medium">Inventory</P>
          <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
            <DateRangePicker
              triggerVariant="secondary"
              triggerSize="sm"
              triggerClassName="ml-auto w-56 sm:w-60"
              align="end"
            />
          </React.Suspense>
        </div>
        <div className="grid min-h-[calc(100vh_-_100px)] place-items-center items-center py-3">
          <React.Suspense fallback={<LoadingSpinner />}>
            <RoleManagementTable roleManagementPromise={roleManagementPromise} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
