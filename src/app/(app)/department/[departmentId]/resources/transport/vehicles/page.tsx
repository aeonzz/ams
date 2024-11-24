import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../../_components/department-layout";
import DepartmentVehicleScreen from "./_components";

export interface DepartmentVehiclePage {
  params: {
    departmentId: string;
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
