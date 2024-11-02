import ContentLayout from "@/components/layouts/content-layout";
import DepartmentVehicleScreen from "./components";
import DepartmentLayout from "../../_components/department-layout";

export interface DepartmentVehiclePage {
  params: {
    departmentId: string;
    vehicleId: string;
  };
}

export default function DepartmentVehiclePage({
  params,
}: DepartmentVehiclePage) {
  return (
    <ContentLayout title="Vehicles">
      <DepartmentLayout departmentId={params.departmentId} name="Vehicles">
        <DepartmentVehicleScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
