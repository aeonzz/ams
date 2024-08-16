import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import CommandLayout from "@/components/layouts/command-layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import SessionProvider from "@/components/providers/session-provider";
import FetchDataError from "@/components/screens/error";

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

  // if (data.role === "SYSTEMADMIN") {
  //   return redirect("/admin");
  // }

  return (
    <SessionProvider user={data}>
      <DashboardLayout>
        <CommandLayout>{children}</CommandLayout>
      </DashboardLayout>
    </SessionProvider>
  );
}
