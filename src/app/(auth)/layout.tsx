import { redirect } from "next/navigation";
import { getUserAuth } from "@/lib/auth/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserAuth();
  if (session?.session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* <div className="absolute -left-16 -top-[95px] h-[150px] w-[800px] -rotate-[15deg] overflow-hidden border-8 border-primary bg-yellow"></div>

      <div className="absolute -bottom-[95px] -right-16 h-[150px] w-[800px] -rotate-[15deg] overflow-hidden border-8 border-primary bg-yellow"></div> */}

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
