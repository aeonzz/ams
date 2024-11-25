import type { VenueRequest } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type DepartmentVenueRequest = VenueRequest & {
  id: string;
  completedAt: Date | null;
  title: string;
  rejectionReason?: string;
  requester: string;
  reviewer?: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  updatedAt: Date;
  venueName: string;
};


export type VenueRequestCalendarType = {
  title: string;
  requestId: string;
  status: RequestStatusTypeType;
  createdAt: Date;
  startTime: Date;
  endTime: Date;
  actualStart: Date | null;
  completedAt: Date | null;
};