"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { userSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import UsersScreen from "./_components";

export interface MyRequestPage {
  searchParams: SearchParams;
}

export default function UsersPage({ searchParams }: MyRequestPage) {
  const search = userSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Users">
      <UsersScreen params={search} />
    </ContentLayout>
  );
}
