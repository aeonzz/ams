"use memo";

import React, { useState } from "react";
import ContentLayout from "@/components/layouts/content-layout";
import MyRequestsScreen from "@/components/screens/requests";
import { searchParamsSchema } from "@/lib/schema";
import { SearchParams } from "@/lib/types";

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function MyRequestPage({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams);

  return (
    <ContentLayout title="Requests">
      <MyRequestsScreen search={search} />
    </ContentLayout>
  );
}
