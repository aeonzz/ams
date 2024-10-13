import ContentLayout from "@/components/layouts/content-layout";
import ManageVenueScreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentVenuesPage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function DepartmentVenuesPage({ params }: DepartmentVenuesPage) {
  return (
    <ContentLayout title="Venues">
      <DepartmentLayout departmentId={params.departmentId}>
        <ManageVenueScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
