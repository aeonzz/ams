"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { venueSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import ManageVenueScreen from "./_components";

export interface ManageVenuePage {
  params: { departmentId: string };
}

export default function ManageVenuePage({ params }: ManageVenuePage) {
  return (
    <ContentLayout title="Venues">
      <ManageVenueScreen params={params.departmentId} />
    </ContentLayout>
  );
}
