import ContentLayout from "@/components/layouts/content-layout";
import InventorySubitemRequestsScreen from "./_components";
import { SearchParams } from "@/lib/types";
import {  itemRequestSearchParamsSchema } from "@/lib/schema";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";

export interface InventorySubitemRequestsPage {
  params: {
    departmentId: string;
    inventoryId: string;
    subId: string;
  };
  searchParams: SearchParams;
}

export default function InventorySubitemRequestsPage({
  params,
  searchParams,
}: InventorySubitemRequestsPage) {
  const search = itemRequestSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Inventory Items Screen">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Item Requests"
        withBackButton
        container={false}
      >
        <InventorySubitemRequestsScreen params={params} searchParams={search} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
