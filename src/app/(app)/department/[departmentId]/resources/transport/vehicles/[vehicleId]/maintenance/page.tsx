"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleMaintenanceHistoryParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import VehicleMaintenanceScreen from "./_components";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface VehicleMaintenancePageProps {
  params: {
    departmentId: string;
    vehicleId: string;
  };
  searchParams: SearchParams;
}

export default function VehicleMaintenancePage({
  params,
  searchParams,
}: VehicleMaintenancePageProps) {
  const search = vehicleMaintenanceHistoryParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Vehicle Logs">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Vehicle Maintenance History"
        withBackButton
      >
        <VehicleMaintenanceScreen params={params} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
