import ContentLayout from "@/components/layouts/content-layout";
import { PageGuard } from "@/components/page-guard";
import { currentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";
import VehicleLogsScreen from "./_components";

export interface VehicleLogsPage {
  params: {
    departmentId: string;
    vehicleId: string;
  };
}

export default async function VehicleLogsPage({ params }: VehicleLogsPage) {
  const { departmentId, vehicleId } = params;
  const [data] = await currentUser();

  if (!data) {
    redirect("/sign-in");
  }

  return (
    <PageGuard
      allowedRoles={["DEPARTMENT_HEAD"]}
      allowedDepartment={params.departmentId}
      //@ts-ignore
      currentUser={data}
    >
      <ContentLayout title="Vehicles">
        <VehicleLogsScreen vehicleId={vehicleId} />
      </ContentLayout>
    </PageGuard>
  );
}
