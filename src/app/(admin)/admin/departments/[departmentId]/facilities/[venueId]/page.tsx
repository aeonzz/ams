import ContentLayout from "@/components/layouts/content-layout";
import ManageVenueScreen from "./_components";

export interface ManageVenuePage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function ManageVenuePage({ params }: ManageVenuePage) {
  return (
    <ContentLayout title="Venues">
      <ManageVenueScreen params={params} />
    </ContentLayout>
  );
}
