import ContentLayout from "@/components/layouts/content-layout";
import InventorySubItemsScreen from "./_components";

export interface InventorySubitemsPage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function InventorySubitemsPage({ params }: InventorySubitemsPage) {
  return (
    <ContentLayout title="Venues">
      <InventorySubItemsScreen params={params} />
    </ContentLayout>
  );
}
