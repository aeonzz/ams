"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { inventorySubItemSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import InventorySubItemsScreen from "./_components";

export interface InventorySubItemsDetailsPageProps {
  searchParams: SearchParams;
}

export default function InventorySubItemsDetailsPage({
  searchParams,
}: InventorySubItemsDetailsPageProps) {
  const search = inventorySubItemSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Inventory Details">
      <InventorySubItemsScreen params={search} />
    </ContentLayout>
  );
}
