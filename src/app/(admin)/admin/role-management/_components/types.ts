import { Option } from "./input-popover";

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
