"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { type SearchParams } from "@/lib/types";
import SupplyItemsScreen from "./_components";
import { SupplyItemSearchParamsSchema } from "@/lib/schema";

export interface SupplyItemsPageProps {
  searchParams: SearchParams;
}

export default function SupplyItemsPage({
  searchParams,
}: SupplyItemsPageProps) {
  const search = SupplyItemSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Supply Items">
      <SupplyItemsScreen params={search} />
    </ContentLayout>
  );
}
