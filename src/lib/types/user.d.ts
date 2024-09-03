import { File, Setting, User } from "prisma/generated/zod";

export type UserType = User & {
  setting: Setting | null;
};
