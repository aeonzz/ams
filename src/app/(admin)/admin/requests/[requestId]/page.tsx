import React from "react";
import ContentLayout from "@/components/layouts/content-layout";
import RequestDetails from "@/app/(app)/request/[requestId]/_components";

export interface RequestDetailsPage {
  params: {
    requestId: string;
  };
}

export default function RequestDetailsPage({ params }: RequestDetailsPage) {
  return (
    <ContentLayout title="Request Details">
      <RequestDetails params={params.requestId} />
    </ContentLayout>
  );
}
