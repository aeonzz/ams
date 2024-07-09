import { File, User } from "prisma/generated/zod";

export type UserType = User & {
  profileImageData: string | null;
  files: File[];
};
