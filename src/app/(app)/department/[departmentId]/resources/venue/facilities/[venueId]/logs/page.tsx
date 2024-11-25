"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import VenueLogsScreen from "./_components";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface VenueLogsPageProps {
  params: {
    departmentId: string;
    venueId: string;
  };
  searchParams: SearchParams;
}

export default function VenueLogsPage({
  params,
  searchParams,
}: VenueLogsPageProps) {
  const search = vehicleSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Vehicle Logs">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Vehicle Request History"
        withBackButton
      >
        <VenueLogsScreen params={params} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
