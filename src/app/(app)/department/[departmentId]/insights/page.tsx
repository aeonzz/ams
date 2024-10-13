import ContentLayout from "@/components/layouts/content-layout";
import DepartmentInsightsScreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentInsights {
  params: {
    departmentId: string;
  };
}

export default function DepartmentInsights({ params }: DepartmentInsights) {
  return (
    <ContentLayout title="Overview">
      <DepartmentLayout departmentId={params.departmentId}>
        <DepartmentInsightsScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
