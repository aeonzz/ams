import { currentUser } from "@/lib/actions/users";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ContentLayout from "@/components/navigations/content-layout";
import DashboardScreen from "@/components/screens/dashboard";
import FetchDataError from "@/components/screens/fetch-data-error";

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
