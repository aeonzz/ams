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
  // Check if the user has the required role in the allowed department
  const hasPermission = currentUser.userRole.some((userRole) => {
    const isAllowedRole = allowedRoles.includes(userRole.role.name);
    const isInAllowedDepartment =
      !allowedDepartment || userRole.departmentId === allowedDepartment;

    return isAllowedRole && isInAllowedDepartment;
  });

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
