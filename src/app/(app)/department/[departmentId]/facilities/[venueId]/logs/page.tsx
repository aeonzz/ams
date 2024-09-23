import ContentLayout from "@/components/layouts/content-layout";
import VenueLogsScreen from "./_components";
import { PageGuard } from "@/components/page-guard";
import { currentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";

export interface VenueLogsPage {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default async function VenueLogsPage({ params }: VenueLogsPage) {
  const { departmentId, venueId } = params;
  const [data] = await currentUser();

  if (!data) {
    redirect("/sign-in");
  }

  return (
    <PageGuard
      allowedRoles={["DEPARTMENT_HEAD", "VENUE_MANAGER"]}
      allowedDepartment={params.departmentId}
      //@ts-ignore
      currentUser={data}
    >
      <ContentLayout title="Venues">
        <VenueLogsScreen venueId={venueId} />
      </ContentLayout>
    </PageGuard>
  );
}
