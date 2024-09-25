import ContentLayout from "@/components/layouts/content-layout";
import DepartmentVehicleScreen from "./components";

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
      <DepartmentVehicleScreen departmentId={params.departmentId} />
    </ContentLayout>
  );
}
