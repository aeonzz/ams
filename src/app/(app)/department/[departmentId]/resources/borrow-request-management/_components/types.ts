import type { ReturnableRequest } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type DepartmentBorrowableRequest = Omit<
  ReturnableRequest,
  "inProgress" | "isOverdue" | "isReturned"
> & {
  id: string;
  completedAt: Date | null;
  title: string;
  rejectionReason?: string;
  requester: string;
  reviewer?: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  updatedAt: Date;
  itemName: string;
  inProgress: boolean | null;
  isOverdue: boolean | null;
  isReturned: boolean | null;
};
