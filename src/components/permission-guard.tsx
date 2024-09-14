"use client";

import { UserWithRelations } from "prisma/generated/zod";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  currentUser: UserWithRelations;
  allowedRoles: string[];
  allowedSection?: string;
}

export function PermissionGuard({
  children,
  allowedRoles,
  allowedSection,
  currentUser,
}: PermissionGuardProps) {
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  const hasAllowedSection =
    !allowedSection || currentUser.sectionId === allowedSection;
  if (!hasAllowedRole || !hasAllowedSection) {
    return null;
  }

  return <>{children}</>;
}
