"use memo";

import ContentLayout from "@/components/layouts/content-layout";
import { jobSectionSearchParamsSchema } from "@/lib/schema";
import { type SearchParams } from "@/lib/types";
import JobSectionScreen from "./_components";

export interface JobSectionPageProps {
  searchParams: SearchParams;
}

export default function JobSectionPage({ searchParams }: JobSectionPageProps) {
  const search = jobSectionSearchParamsSchema.parse(searchParams);
  return (
    <ContentLayout title="Job Section">
      <JobSectionScreen params={search} />
    </ContentLayout>
  );
}
