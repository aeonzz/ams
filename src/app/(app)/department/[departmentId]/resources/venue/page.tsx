import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../_components/department-layout";
import DepartmentVenueScreen from "./_components";
import { SearchParams } from "@/lib/types";
import { requestSearchParamsSchema } from "@/lib/schema";

export interface DepartmentVenuePagePage {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function DepartmentVenuePagePage({
  params,
  searchParams,
}: DepartmentVenuePagePage) {
  const search = requestSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Venue Management">
      <DepartmentLayout departmentId={params.departmentId} name="Venue Management" withBackButton>
        <DepartmentVenueScreen departmentId={params.departmentId} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
