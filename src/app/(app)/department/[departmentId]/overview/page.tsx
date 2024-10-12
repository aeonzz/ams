import ContentLayout from "@/components/layouts/content-layout";
import DepartmentOverviewSchreen from "./_components";

export interface DepartmentOverview {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function DepartmentOverview({ params }: DepartmentOverview) {
  return (
    <ContentLayout title="Overview">
      <DepartmentOverviewSchreen departmentId={params.departmentId} />
    </ContentLayout>
  );
}
