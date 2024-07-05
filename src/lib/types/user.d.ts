import { File, User } from "prisma/generated/zod";

export type UserType = User & {
  files: File[];
};
