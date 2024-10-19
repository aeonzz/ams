"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import ManageRequestScreen from "./_components";
import { RoleGuard } from "@/components/role-guard";
import NotFound from "@/app/not-found";
import DepartmentLayout from "../../_components/department-layout";

export interface ManageRequestPageProps {
  params: { departmentId: string };
  searchParams: SearchParams;
}

export default async function ManageRequestPage({
  params,
  searchParams,
}: ManageRequestPageProps) {
  const search = requestSearchParamsSchema.parse(searchParams);
  const { departmentId } = params;
  return (
    <RoleGuard allowedRoles={["REQUEST_MANAGER", "DEPARTMENT_HEAD"]}>
      <ContentLayout title="Requests">
        <DepartmentLayout departmentId={params.departmentId}  name="Pending Requests">
          <ManageRequestScreen search={search} departmentId={departmentId} />
        </DepartmentLayout>
      </ContentLayout>
    </RoleGuard>
  );
}
