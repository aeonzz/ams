import ContentLayout from "@/components/layouts/content-layout";
import ManageVenueScreen from "./_components";

export interface ManageVenuePage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function ManageVenuePage({ params }: ManageVenuePage) {
  const { departmentId, venueId } = params;

  return (
    <ContentLayout title="Venues">
      <ManageVenueScreen venueId={venueId} />
    </ContentLayout>
  );
}
