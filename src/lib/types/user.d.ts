import { Department } from "@prisma/client";
import { User, UserRole } from "prisma/generated/zod";

export type UserType = User & {
  userRole: {
    department: {
      name: string;
    };
    role: {
      name: string;
    };
    id: string;
    departmentId: string;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  department: Department | null;
  sectionId: string | null;
  sectionName: string | null;
};
