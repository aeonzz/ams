import ContentLayout from "@/components/layouts/content-layout";
import ManageVenueScreen from "./_components";

export interface DepartmentVenuesPage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function DepartmentVenuesPage({ params }: DepartmentVenuesPage) {
  return (
    <ContentLayout title="Venues">
      <ManageVenueScreen departmentId={params.departmentId} />
    </ContentLayout>
  );
}
