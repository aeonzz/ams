import ContentLayout from "@/components/layouts/content-layout";
import BorrowServiceScreen from "./_components";
import DepartmentLayout from "../../_components/department-layout";

export interface BorrowServiceProps {
  params: {
    departmentId: string;
  };
}

export default function BorrowService({ params }: BorrowServiceProps) {
  return (
    <ContentLayout title="Borrow Service">
      <DepartmentLayout
        departmentId={params.departmentId}
        name="Borrow Service"
      >
        <BorrowServiceScreen departmentId={params.departmentId} />
      </DepartmentLayout>
    </ContentLayout>
  );
}
