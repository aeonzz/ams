import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import DepartmentBorrowableItemsRequestsScreen from "./_components";
import DepartmentLayout from "../../_components/department-layout";

export interface DepartmentBorrowableItemsRequestsPageProps {
  params: { departmentId: string };
  searchParams: SearchParams;
}

export default async function DepartmentBorrowableItemsRequestsPage({
  params,
  searchParams,
}: DepartmentBorrowableItemsRequestsPageProps) {
  const search = requestSearchParamsSchema.parse(searchParams);
  const { departmentId } = params;
  return (
    <ContentLayout title="Requests">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Borrow Requests Management"
        container={false}
        withBackButton
      >
        <DepartmentBorrowableItemsRequestsScreen
          searchParams={search}
          departmentId={departmentId}
        />
      </DepartmentLayout>
    </ContentLayout>
  );
}
