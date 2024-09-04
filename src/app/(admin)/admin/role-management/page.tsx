"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { roleManagementSearchParamsSchema } from "@/lib/schema";
import { type SearchParams } from "@/lib/types";
import RoleManagementScreen from "./_components";

export interface RoleManagementPageProps {
  searchParams: SearchParams;
}

export default function RoleManagementPage({ searchParams }: RoleManagementPageProps) {
  const search = roleManagementSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Role Management">
      <RoleManagementScreen params={search} />
    </ContentLayout>
  );
}
