import ContentLayout from "@/components/layouts/content-layout";
import DepartmentJobRequestScreen from "./_components";
import { SearchParams } from "@/lib/types";
import { requestSearchParamsSchema } from "@/lib/schema";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentJobRequestPage {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function DepartmentJobRequestPage({
  params,
  searchParams,
}: DepartmentJobRequestPage) {
  const search = requestSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Job Request Management">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Job Request Management"
        withBackButton
      >
        <DepartmentJobRequestScreen
          departmentId={params.departmentId}
          searchParams={search}
        />
      </DepartmentLayout>
    </ContentLayout>
  );
}
