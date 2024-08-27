"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { SearchParams } from "@/lib/types";
import { vehicleSearchParamsSchema } from "@/lib/schema";
import VehiclesScreen from "./_components";

export interface VehiclesPage {
  searchParams: SearchParams;
}

export default function VehiclesPage({ searchParams }: VehiclesPage) {
  const search = vehicleSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Venues">
      <VehiclesScreen params={search} />
    </ContentLayout>
  );
}
