"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { venueSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import ManageVenueScreen from "./_components";

export interface ManageVenuePage {
  searchParams: SearchParams;
}

export default function ManageVenuePage({ searchParams }: ManageVenuePage) {
  const search = venueSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Venues">
      <ManageVenueScreen params={search} />
    </ContentLayout>
  );
}
