import { Department, User } from "prisma/generated/zod";

export type RoleType = {
  id: string;
  name: string;
  userRolesCount: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userRoles: UserRole[];
};

export type UserRole = {
  id: string;
  user: User;
  userId: string;
  roleId: string;
  department: Department;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
};
