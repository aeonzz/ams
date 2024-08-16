import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import CommandLayout from "@/components/layouts/command-layout";
import SessionProvider from "@/components/providers/session-provider";
import FetchDataError from "@/components/screens/error";
import { redirect } from "next/navigation";
import AdminDashboardLayout from "@/components/layouts/admin-dashboard-layout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const [data] = await currentUser();

  if (!data) {
    return <FetchDataError />;
  }

  // if (data.role !== "SYSTEMADMIN") {
  //   return redirect("/dashboard");
  // }

  return (
    <SessionProvider user={data}>
      <AdminDashboardLayout>
        <CommandLayout>{children}</CommandLayout>
      </AdminDashboardLayout>
    </SessionProvider>
  );
}
