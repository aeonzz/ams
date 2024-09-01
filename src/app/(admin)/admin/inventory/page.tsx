"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { inventoryItemSearchParamsSchema } from "@/lib/schema";
import { type SearchParams } from "@/lib/types";
import InventoryScreen from "./_components";

export interface InventoryPageProps {
  searchParams: SearchParams;
}

export default function InventoryPage({ searchParams }: InventoryPageProps) {
  const search = inventoryItemSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Inventory">
      <InventoryScreen params={search} />
    </ContentLayout>
  );
}
