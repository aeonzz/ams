"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { SearchParams } from "@/lib/types";
import VenuesScreen from "./_components";
import { venueSearchParamsSchema } from "@/lib/schema";

export interface MyRequestPage {
  searchParams: SearchParams;
}

export default function VenuesPage({ searchParams }: MyRequestPage) {
  const search = venueSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Venues">
      <VenuesScreen params={search} />
    </ContentLayout>
  );
}
