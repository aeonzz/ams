import ContentLayout from "@/components/layouts/content-layout";
import DashboardScreen from "@/components/screens/dashboard";

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <DashboardScreen />
    </ContentLayout>
  );
}
