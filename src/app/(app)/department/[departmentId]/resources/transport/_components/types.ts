import type { TransportRequest as VehicleRequest } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type TransportRequest = VehicleRequest & {
  id: string;
  completedAt: Date | null;
  title: string;
  rejectionReason?: string;
  requester: string;
  reviewer?: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  updatedAt: Date;
  vehicleName: string;
};

export type TransportRequestCalendar = {
  title: string;
  requestId: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  actualStart: Date | null
  completedAt: Date | null
};
