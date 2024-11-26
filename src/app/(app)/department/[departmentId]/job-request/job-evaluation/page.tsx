"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { vehicleSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import JobEvaluationScreen from "./_components";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface VenueLogsPageProps {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function VenueLogsPage({
  params,
  searchParams,
}: VenueLogsPageProps) {
  const search = vehicleSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Job Evaluation">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Job Evaluation"
        withBackButton
      >
        <JobEvaluationScreen departmentId={params.departmentId} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
