"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { userSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import DepartmentUsersScreen from "./_components";
import DepartmentLayout from "../_components/department-layout";

export interface DepartmentUsersPageProps {
  params: { departmentId: string };
  searchParams: SearchParams;
}

export default async function DepartmentUsersPage({
  params,
  searchParams,
}: DepartmentUsersPageProps) {
  const search = userSearchParamsSchema.parse(searchParams);
  const { departmentId } = params;

  return (
    <ContentLayout title="Users">
      <DepartmentLayout departmentId={params.departmentId} name="Users">
        <DepartmentUsersScreen search={search} departmentId={departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
