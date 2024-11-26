import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../../_components/department-layout";
import DepartmentFacilitiesScreen from "./_components";

export interface DepartmentFacilitiesPage {
  params: {
    departmentId: string;
  };
}

export default function DepartmentFacilitiesPage({
  params,
}: DepartmentFacilitiesPage) {
  return (
    <ContentLayout title="Facilities">
      <DepartmentLayout departmentId={params.departmentId} name="Facilities" withBackButton>
        <DepartmentFacilitiesScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
