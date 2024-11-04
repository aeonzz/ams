import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import SessionProvider from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import Error from "@/components/error";
import AdminDashboardLayout from "./_components/admin-dashboard-layout";
import { RoleGuard } from "@/components/role-guard";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const [data] = await currentUser();

  if (!data) {
    return <Error />;
  }

  return (
    //@ts-ignore
    <SessionProvider user={data}>
      {/* <RoleGuard allowedRoles={["ADMIN"]}> */}
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
      {/* </RoleGuard> */}
    </SessionProvider>
  );
}
