import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import CommandLayout from "@/components/layouts/command-layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import SessionProvider from "@/components/providers/session-provider";
import FetchDataError from "@/components/screens/fetch-data-error";


export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await checkAuth();
  const [data] = await currentUser();
  console.log(data)
  if (!data) {
    return <FetchDataError />;
  }

  return (
    <SessionProvider user={data}>
      <DashboardLayout>
        <CommandLayout>
          {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
          {children}
        </CommandLayout>
      </DashboardLayout>
    </SessionProvider>
  );
}
