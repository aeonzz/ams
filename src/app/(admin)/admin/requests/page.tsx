import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { type SearchParams } from "@/lib/types";
import RequestsScreen from "./_components";

export interface InventoryPageProps {
  searchParams: SearchParams;
}

export default function InventoryPage({ searchParams }: InventoryPageProps) {
  const search = requestSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Requests">
      <RequestsScreen params={search} />
    </ContentLayout>
  );
}
