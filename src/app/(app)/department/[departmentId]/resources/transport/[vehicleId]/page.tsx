import ContentLayout from "@/components/layouts/content-layout";
import ManageVehicleScreen from "./_components";

export interface ManageVehiclePage {
  params: {
    departmentId: string;
    vehicleId: string;
  };
}

export default function ManageVehiclePage({ params }: ManageVehiclePage) {
  return (
    <ContentLayout title="Vehicle">
      <ManageVehicleScreen params={params} />
    </ContentLayout>
  );
}
