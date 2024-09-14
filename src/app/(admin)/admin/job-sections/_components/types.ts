import { Section } from "prisma/generated/zod";
import { string } from "zod";

export type Users = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: {
    id: string;
    name: string;
  };
};

export type Sections = {
  id: string;
  name: string;
};

export type UsersAndSections = {
  users: Users[];
  sections: Sections[];
};

export type JobSectionData = Section & {
  user: {
    id: string;
    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    department: {
      id: string;
      name: string;
    } | null;
  }[];
};

export type FormattedSectionUsers = {
  id: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  departmentName: string | undefined;
};
