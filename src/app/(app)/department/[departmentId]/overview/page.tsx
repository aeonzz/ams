import ContentLayout from "@/components/layouts/content-layout";
import DepartmentOverviewSchreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentOverview {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function DepartmentOverview({ params }: DepartmentOverview) {
  return (
    <ContentLayout title="Overview">
      <DepartmentLayout departmentId={params.departmentId}>
        <DepartmentOverviewSchreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
