"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import ManageRequestScreen from "./_components";
import { RoleGuard } from "@/components/role-guard";

export interface ManageRequestPage {
  searchParams: SearchParams;
}

export default async function ManageRequestPage({
  searchParams,
}: ManageRequestPage) {
  const search = requestSearchParamsSchema.parse(searchParams);

  return (
    <RoleGuard allowedRoles={["REQUEST_REVIEWER", "REQUEST_MANAGER"]}>
      <ContentLayout title="Requests">
        <ManageRequestScreen search={search} />
      </ContentLayout>
    </RoleGuard>
  );
}
