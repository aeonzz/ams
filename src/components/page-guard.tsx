"use client";

import NotFound from "@/app/not-found";
import { UserWithRelations } from "prisma/generated/zod";
import { ReactNode } from "react";

interface PageGuardProps {
  children: ReactNode;
  currentUser: UserWithRelations;
  allowedRoles: string[];
  allowedDepartment?: string;
}

export function PageGuard({
  children,
  allowedRoles,
  allowedDepartment,
  currentUser,
}: PageGuardProps) {
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  const hasAllowedDepartment =
    !allowedDepartment ||
    currentUser.userDepartments.some(
      (department) => department.departmentId === allowedDepartment
    );

  if (!hasAllowedRole || !hasAllowedDepartment) {
    return <NotFound />;
  }

  return <>{children}</>;
}
