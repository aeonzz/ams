import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../_components/department-layout";
import DepartmentTransportScreen from "./_components";
import { SearchParams } from "@/lib/types";
import { requestSearchParamsSchema } from "@/lib/schema";

export interface DepartmentTransportPage {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function DepartmentTransportPage({
  params,
  searchParams,
}: DepartmentTransportPage) {
  const search = requestSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Transport">
      <DepartmentLayout departmentId={params.departmentId} name="Transport" withBackButton>
        <DepartmentTransportScreen departmentId={params.departmentId} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
