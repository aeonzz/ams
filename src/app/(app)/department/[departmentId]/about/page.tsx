import ContentLayout from "@/components/layouts/content-layout";
import AboutDepartmentScreen from "./_components";

export interface AboutDepartment {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function AboutDepartment({ params }: AboutDepartment) {
  return (
    <ContentLayout title="About">
      <AboutDepartmentScreen departmentId={params.departmentId} />
    </ContentLayout>
  );
}
