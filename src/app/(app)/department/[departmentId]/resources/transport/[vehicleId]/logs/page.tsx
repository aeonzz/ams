"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import VehicleLogsScreen from "./_components";

export interface VehicleLogsPageProps {
  params: {
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
      <VehicleLogsScreen params={params} searchParams={search} />
    </ContentLayout>
  );
}
