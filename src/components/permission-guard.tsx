"use client";

import { UserWithRelations } from "prisma/generated/zod";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  currentUser: UserWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
}

export function PermissionGuard({
  children,
  allowedRoles,
  allowedDepartment,
  currentUser,
}: PermissionGuardProps) {
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  const hasAllowedDepartment =
    !allowedDepartment || currentUser.departmentId === allowedDepartment;

  // if (allowedSection !== undefined) {
  //   if (hasAllowedRole && allowedSection !== currentUser.sectionId) {
  //     return null;
  //   }
  // }

  if (!hasAllowedRole || !hasAllowedDepartment) {
    return null;
  }

  return <>{children}</>;
}
