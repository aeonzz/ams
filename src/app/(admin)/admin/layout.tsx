import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import SessionProvider from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import Error from "@/components/error";
import AdminDashboardLayout from "./_components/admin-dashboard-layout";
import UnauthorizedPage from "@/app/unauthorized/page";

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
  if (!data.isAdmin) {
    redirect('/unauthrorized')
  }
  return (
    //@ts-ignore
    <SessionProvider user={data}>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </SessionProvider>
  );
}
