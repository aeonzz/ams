"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { departmentSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import DepartmentScreen from "./_components";

export interface EquipmentsPageProps {
  searchParams: SearchParams;
}

export default function EquipmentsPage({ searchParams }: EquipmentsPageProps) {
  const search = departmentSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Departments">
      <DepartmentScreen params={search} />
    </ContentLayout>
  );
}
