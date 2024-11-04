import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import DashboardLayout from "@/app/(app)/_components/dashboard-layout";
import SessionProvider from "@/components/providers/session-provider";
import Error from "@/components/error";
import { db } from "@/lib/db/index";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const [data] = await currentUser();

  if (!data) {
    return redirect("/sign-in");
  }

  // if (data.role === "SYSTEMADMIN") {
  //   return redirect("/admin");
  // }

  const notification = await db.notification.findMany({
    where: {
      recepientId: data.id,
      isRead: false,
    },
  });

  return (
    //@ts-ignore
    <SessionProvider user={data}>
      <DashboardLayout notification={notification}>
        {/* <CommandLayout> */}
        {children}
        {/* </CommandLayout> */}
      </DashboardLayout>
    </SessionProvider>
  );
}
