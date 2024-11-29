import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../_components/department-layout";
import DepartmentSupplyItemsScreen from "./_components";
import type { SearchParams } from "@/lib/types";
import { SupplyItemSearchParamsSchema } from "@/lib/schema";

export interface DepartmentSupplyItems {
  params: {
    departmentId: string;
  };
  searchParams: SearchParams;
}

export default function DepartmentSupplyItems({
  params,
  searchParams,
}: DepartmentSupplyItems) {
  const search = SupplyItemSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Supply Items">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Borrowable Items"
        withBackButton
        container={false}
      >
        <DepartmentSupplyItemsScreen
          departmentId={params.departmentId}
          searchParams={search}
        />
      </DepartmentLayout>
    </ContentLayout>
  );
}
