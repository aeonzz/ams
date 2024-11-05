import React from "react";
import ContentLayout from "@/components/layouts/content-layout";
import MyRequestScreenParams from "./_components";

export interface MyRequestPageParams {
  params: {
    requestId: string;
  };
}

export default function MyRequestPageParams({ params }: MyRequestPageParams) {
  return (
    <ContentLayout title="Requests">
      <MyRequestScreenParams params={params.requestId} />
    </ContentLayout>
  );
}
