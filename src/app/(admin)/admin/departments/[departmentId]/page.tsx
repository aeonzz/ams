"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { userSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import DepartmentUsers from "./_components";

export interface DepartmentUsersPageProps {
  searchParams: SearchParams;
  departmentId: string;
}

export default function DepartmentUsersPage({ searchParams, departmentId }: DepartmentUsersPageProps) {
  const search = userSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Departments">
      <DepartmentUsers params={search} departmentId={departmentId} />
    </ContentLayout>
  );
}
