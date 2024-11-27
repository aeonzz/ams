import ContentLayout from "@/components/layouts/content-layout";
import DepartmentLayout from "../../_components/department-layout";
import DepartmentBorrowableItemsScreen from "./_components";

export interface DepartmentBorrowableItems {
  params: {
    departmentId: string;
  };
}

export default function DepartmentBorrowableItems({
  params,
}: DepartmentBorrowableItems) {
  return (
    <ContentLayout title="Venues">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Borrowable Items"
        withBackButton
      >
        <DepartmentBorrowableItemsScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
