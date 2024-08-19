"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import { requestSearchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";
import MyRequestsScreen from "./_components";

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
