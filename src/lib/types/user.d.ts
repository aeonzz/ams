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
  userDepartments: {
    id: string;
    department: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      firstName: string;
      middleName: string | null;
      lastName: string;
    };
  }[];
};
