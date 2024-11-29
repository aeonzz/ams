"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { JobEvaluationParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import JobEvaluationScreen from "./_components";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface JobEvaluationPageProps {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function JobEvaluationPage({
  params,
  searchParams,
}: JobEvaluationPageProps) {
  const search = JobEvaluationParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Job Evaluation">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Job Evaluation"
        withBackButton
        container={false}
      >
        <JobEvaluationScreen
          departmentId={params.departmentId}
          searchParams={search}
        />
      </DepartmentLayout>
    </ContentLayout>
  );
}
