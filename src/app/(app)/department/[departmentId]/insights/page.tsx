import ContentLayout from "@/components/layouts/content-layout";
import DepartmentInsightsScreen from "./_components";

export interface DepartmentInsights {
  params: {
    departmentId: string;
  };
}

export default function DepartmentInsights({ params }: DepartmentInsights) {
  return (
    <ContentLayout title="Overview">
      <DepartmentInsightsScreen departmentId={params.departmentId} />
    </ContentLayout>
  );
}
