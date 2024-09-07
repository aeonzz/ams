"use client";

import { UserWithRelations } from "prisma/generated/zod";
import { ReactNode } from "react";

interface ClientRoleGuardProps {
  children: ReactNode;
  currentUser: UserWithRelations;
  allowedRoles: string[];
}

export function ClientRoleGuard({
  children,
  allowedRoles,
  currentUser,
}: ClientRoleGuardProps) {
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  if (!hasAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
