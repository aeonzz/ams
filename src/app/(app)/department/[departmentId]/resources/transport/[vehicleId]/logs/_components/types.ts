import type { TransportRequest } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type VehicleRequests = TransportRequest & {
  id: string;
  completedAt: Date | null;
  title: string;
  rejectionReason?: string;
  requester: string;
  reviewer?: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  updatedAt: Date;
};
