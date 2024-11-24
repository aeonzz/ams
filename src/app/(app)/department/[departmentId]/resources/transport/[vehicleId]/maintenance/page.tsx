"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleMaintenanceHistoryParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import VehicleMaintenanceScreen from "./_components";

export interface VehicleMaintenancePageProps {
  params: {
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
      <VehicleMaintenanceScreen params={params} searchParams={search} />
    </ContentLayout>
  );
}
