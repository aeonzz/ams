"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import VehicleLogsScreen from "./_components";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface VehicleLogsPageProps {
  params: {
    departmentId: string;
    vehicleId: string;
  };
  searchParams: SearchParams;
}

export default function VehicleLogsPage({
  params,
  searchParams,
}: VehicleLogsPageProps) {
  const search = vehicleSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Vehicle Logs">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Vehicle Request History"
        withBackButton
        container={false}
      >
        <VehicleLogsScreen params={params} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
