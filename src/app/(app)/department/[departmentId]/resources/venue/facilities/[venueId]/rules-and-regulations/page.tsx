import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "@/app/(app)/department/[departmentId]/_components/department-layout";
import Editor from "@/components/tiptap/editor";
import { db } from "@/lib/db";

export interface VenueLogsPageProps {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default async function VenueLogsPage({ params }: VenueLogsPageProps) {
  const rules = await db.venue.findUnique({
    where: {
      id: params.venueId,
    },
    select: {
      rulesAndRegulations: true,
    },
  });
  return (
    <ContentLayout title="Rules and Regulations">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Venue Rules and Regulations"
        withBackButton
      >
        <Editor content={rules?.rulesAndRegulations} venueId={params.venueId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
