import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import CommandLayout from "@/components/layouts/command-layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import SessionProvider from "@/components/providers/session-provider";
import FetchDataError from "@/components/screens/fetch-data-error";
import FontSizeProvider from "@/components/providers/font-size-context";

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

  return (
    <SessionProvider user={data}>
      <FontSizeProvider font={data.setting?.fontSize}>
        <DashboardLayout>
          <CommandLayout>{children}</CommandLayout>
        </DashboardLayout>
      </FontSizeProvider>
    </SessionProvider>
  );
}
