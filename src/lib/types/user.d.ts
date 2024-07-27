import { File, Setting, User } from "prisma/generated/zod";

export type UserType = User & {
  profileImageData: string | null;
  setting: Setting | null;
};
