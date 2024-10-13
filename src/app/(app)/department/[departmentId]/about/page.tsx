import ContentLayout from "@/components/layouts/content-layout";
import AboutDepartmentScreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface AboutDepartment {
  params: {
    departmentId: string;
  };
}

export default function AboutDepartment({ params }: AboutDepartment) {
  return (
    <ContentLayout title="About">
      <DepartmentLayout departmentId={params.departmentId}>
        <AboutDepartmentScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
