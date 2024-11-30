"use client";

import { useSession } from "@/lib/hooks/use-session";
import { UserWithRelations } from "prisma/generated/zod";
import { ReactNode } from "react";

interface ClientRoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function ClientRoleGuard({
  children,
  allowedRoles,
}: ClientRoleGuardProps) {
  const currentUser = useSession();
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  if (!hasAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
