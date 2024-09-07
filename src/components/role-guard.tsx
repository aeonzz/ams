import { currentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export async function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [data] = await currentUser();

  if (!data) {
    redirect("/sign-in");
  }

  const userRoles = Array.isArray(data.userRole) ? data.userRole : [];

  const hasAllowedRole = userRoles.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  if (!hasAllowedRole) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
