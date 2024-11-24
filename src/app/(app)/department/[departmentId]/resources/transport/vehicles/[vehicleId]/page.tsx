import ContentLayout from "@/components/layouts/content-layout";
import ManageVehicleScreen from "./_components";
import DepartmentLayout from "../../../../_components/department-layout";

export interface ManageVehiclePage {
  params: {
    departmentId: string;
    vehicleId: string;
  };
}

export default function ManageVehiclePage({ params }: ManageVehiclePage) {
  return (
    <ContentLayout title="Vehicle">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Vehicle Details"
        withBackButton
      >
        <ManageVehicleScreen params={params} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
