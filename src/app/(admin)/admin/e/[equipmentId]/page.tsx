"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { inventorySearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import EquipmentDetailsScreen from "./_components";

export interface EquipmentDetailsPageProps {
  params: { equipmentId: string };
  searchParams: SearchParams;
}

export default function EquipmentDetailsPage({
  params,
  searchParams,
}: EquipmentDetailsPageProps) {
  const search = inventorySearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Equipment Details">
      <EquipmentDetailsScreen params={{ ...search, id: params.equipmentId }} />
    </ContentLayout>
  );
}
