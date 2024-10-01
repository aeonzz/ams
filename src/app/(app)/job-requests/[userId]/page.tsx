import ContentLayout from "@/components/layouts/content-layout";
import UserJobReportScreen from "./_components";

export interface UserJobReportPage {
  params: {
    userId: string;
  };
}

export default function UserJobReportPage({ params }: UserJobReportPage) {
  return (
    <ContentLayout title="UserJobReport">
      <UserJobReportScreen userId={params.userId} />
    </ContentLayout>
  );
}
