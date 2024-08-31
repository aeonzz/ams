"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { equipmentSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import DepartmentScreen from "./_components";

export interface EquipmentsPageProps {
  searchParams: SearchParams;
}

export default function EquipmentsPage({ searchParams }: EquipmentsPageProps) {
  const search = equipmentSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Equipments">
      <DepartmentScreen params={search} />
    </ContentLayout>
  );
}
