import ContentLayout from "@/components/layouts/content-layout";
import ManageVenueScreen from "./_components";
import DepartmentLayout from "../../../../_components/department-layout";

export interface ManageVenuePage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function ManageVenuePage({ params }: ManageVenuePage) {
  return (
    <ContentLayout title="Venues">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Venue Management"
        withBackButton
      >
        <ManageVenueScreen params={params} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
