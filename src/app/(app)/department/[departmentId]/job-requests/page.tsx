import ContentLayout from "@/components/layouts/content-layout";
import DepartmentJobRequestsScreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentJobRequests {
  params: {
    departmentId: string;
  };
}

export default function DepartmentJobRequests({ params }: DepartmentJobRequests) {
  return (
    <ContentLayout title="Job Requests">
      <DepartmentLayout departmentId={params.departmentId} name="Job Requests">
        <DepartmentJobRequestsScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
