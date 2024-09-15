import type { Role, User, Department, UserRole } from "prisma/generated/zod";
import { Option } from "../../../../../components/input-popover";

export type role = {
  id: string;
  name: string;
};

export type user = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: {
    id: string;
    name: string;
  };
};

export type department = {
  id: string;
  name: string;
};

export type RoleUserDepartmentData = {
  roles: Option[];
  users: user[];
  departments: Option[];
};

export type UserDepartmentData = {
  users: user[];
  departments: Option[];
};

export type RoleTableType = Role & {
  userRoles: (UserRole & {
    user: User;
    role: Role;
    department: Department;
  })[];
};

export type RoleUsersTableType = UserRole & {
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  departmentName: string;
};
