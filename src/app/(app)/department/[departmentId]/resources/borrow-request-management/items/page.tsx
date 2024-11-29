import ContentLayout from "@/components/layouts/content-layout";
import DepartmentBorrowableItemsScreen from "./_components";
import DepartmentLayout from "../../../_components/department-layout";

export interface DepartmentBorrowableItemsPageProps {
  params: {
    departmentId: string;
  };
}

export default function DepartmentBorrowableItemsPage({
  params,
}: DepartmentBorrowableItemsPageProps) {
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
