"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import CanceledRequestsScreen from "./_components";

export interface CancelledRequestsPage {
  searchParams: SearchParams;
}

export default async function CancelledRequestsPage({ searchParams }: CancelledRequestsPage) {
  const search = requestSearchParamsSchema.parse(searchParams);

  return (
    <ContentLayout title="Requests">
      <CanceledRequestsScreen search={search} />
    </ContentLayout>
  );
}
