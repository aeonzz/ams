"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import MyRequestsScreen from "@/components/screens/requests";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";

export interface MyRequestPage {
  searchParams: SearchParams;
}

export default async function MyRequestPage({ searchParams }: MyRequestPage) {
  const search = requestSearchParamsSchema.parse(searchParams);

  return (
    <ContentLayout title="Requests">
      <MyRequestsScreen search={search} />
    </ContentLayout>
  );
}
