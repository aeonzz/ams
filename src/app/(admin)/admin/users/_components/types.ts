type Role = {
  id: string;
  name: string;
};

type Department = {
  id: string;
  name: string;
};

export type RoleDepartmentData = {
  roles: Role[];
  departments: Department[];
};
