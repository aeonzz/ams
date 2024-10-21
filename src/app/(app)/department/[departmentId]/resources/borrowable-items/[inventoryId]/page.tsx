import ContentLayout from "@/components/layouts/content-layout";
import InventorySubItemsScreen from "./_components";
import DepartmentLayout from "../../../_components/department-layout";
import { SearchParams } from "@/lib/types";
import { inventorySubItemSearchParamsSchema } from "@/lib/schema";

export interface InventorySubitemsPage {
  params: {
    departmentId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}

export default function InventorySubitemsPage({
  params,
  searchParams,
}: InventorySubitemsPage) {
  const search = inventorySubItemSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Inventory Items Screen">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Borrowable Items"
      >
        <InventorySubItemsScreen params={params} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
