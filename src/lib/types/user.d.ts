import { Department } from "@prisma/client";
import { File, Role, Setting, User } from "prisma/generated/zod";

export type UserType = User & {
  role: Role[];
  department: Department | null;
};
