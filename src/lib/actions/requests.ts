"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { createCohere } from "@ai-sdk/cohere";
import { generateText } from "ai";
import { z } from "zod";
import { GetRequestsSchema } from "../schema";
import { Request, RequestWithRelations } from "prisma/generated/zod";
import path from "path";
import {
  extendedJobRequestSchema,
  extendedTransportRequestSchema,
  extendedVenueRequestSchema,
  updateJobRequestSchemaServerWithPath,
  updateTransportRequestSchemaWithPath,
  updateVenueRequestSchemaWithPath,
} from "../schema/request";
import { checkAuth } from "../auth/utils";
import { currentUser } from "./users";
import { UserCheck2Icon } from "lucide-react";
import { createNotification } from "./notification";
import { updateReturnableResourceRequestSchemaWithPath } from "../schema/resource/returnable-resource";
import { updateRequestStatusSchemaWithPath } from "@/app/(app)/request/[requestId]/_components/schema";
import { pusher } from "../pusher";
import { transportRequestActions } from "../schema/request/transport";
import { formatFullName } from "../utils";
import { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { generateTitle } from "./ai";
import { sendEmailNotification } from "./email";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export async function getRequests(input: GetRequestsSchema) {
  await checkAuth();
  const {
    page,
    per_page,
    sort,
    title,
    status,
    type,
    priority,
    from,
    to,
    departmentId,
    departmentName,
  } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {};

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = { in: type.split(".") };
    }

    if (priority) {
      where.priority = priority;
    }

    if (departmentName) {
      const departments = departmentName
        .split(".")
        .map((d) => d.trim().replace(/\+/g, " "));

      where.department = {
        name: {
          in: departments,
          mode: "insensitive",
        },
      };
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, department] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          user: true,
          department: true,
          reviewer: true,
        },
      }),
      db.request.count({ where }),
      db.department.findMany(),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = await Promise.all(
      data.map(async (data) => {
        return {
          ...data,
          departmentName: data.department.name,
          requester: formatFullName(
            data.user.firstName,
            data.user.middleName,
            data.user.lastName
          ),
          reviewer: data.reviewer
            ? formatFullName(
                data.reviewer.firstName,
                data.reviewer.middleName,
                data.reviewer.lastName
              )
            : undefined,
        };
      })
    );
    return { data: formattedData, pageCount, departments: department };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const createVenueRequest = authedProcedure
  .createServerAction()
  .input(extendedVenueRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
      const overlappingReservation = await db.venueRequest.findFirst({
        where: {
          request: {
            status: "APPROVED",
          },
          venueId: rest.venueId,
          OR: [
            {
              startTime: {
                lte: rest.endTime,
              },
              endTime: {
                gte: rest.startTime,
              },
            },
          ],
        },
      });

      if (overlappingReservation) {
        throw "The venue is already reserved for the selected time.";
      }

      const requestId = `REQ-${generateId(5)}`;
      const venuRequestId = `VRQ-${generateId(5)}`;

      let title;
      try {
        const text = await generateTitle({
          type: input.type,
          inputs: [input.notes ?? "", input.purpose],
        });
        title = text.title || requestId;
      } catch (error) {
        console.error("Error in title generation:", error);
        title = requestId;
      }

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: title,
          departmentId: rest.departmentId,
          venueRequest: {
            create: {
              id: venuRequestId,
              startTime: rest.startTime,
              endTime: rest.endTime,
              purpose: rest.purpose,
              setupRequirements: rest.setupRequirements,
              notes: rest.notes,
              venueId: rest.venueId,
              departmentId: rest.department,
            },
          },
        },
        include: {
          venueRequest: true,
        },
      });

      const departmentHead = await db.userRole.findFirst({
        where: {
          departmentId: rest.department,
          role: {
            name: "DEPARTMENT_HEAD",
          },
        },
        include: {
          user: true,
        },
      });

      const departmentRoleUsers = await db.userRole.findMany({
        where: {
          departmentId: rest.departmentId,
          role: {
            name: {
              in: ["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"],
            },
          },
        },
        include: {
          user: true,
        },
      });

      const recipientIds = departmentRoleUsers.map(
        (roleUser) => roleUser.userId
      );

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Venue Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new venue request titled "${createdRequest.title}" has been submitted. Please check the details and proceed with the necessary actions.`,
        recepientIds: [...recipientIds, createdRequest.departmentId],
        userId: user.id,
      });

      if (departmentHead) {
        await createNotification({
          resourceId: `/request/${createdRequest.id}`,
          title: `New Venue Request Requires Approval: ${createdRequest.title}`,
          resourceType: "REQUEST",
          notificationType: "INFO",
          message: `A new venue request titled "${createdRequest.title}" requires your approval as department head.`,
          recepientIds: [departmentHead.userId],
          userId: user.id,
        });
      }

      await sendEmailNotification({
        recipientIds: recipientIds,
        resourceId: `/request/${createdRequest.id}`,
        title: `New Venue Request: ${createdRequest.title}`,
        payload: `A new venue request titled "${createdRequest.title}" has been submitted. Please check the details and proceed with the necessary actions.`,
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const createTransportRequest = authedProcedure
  .createServerAction()
  .input(extendedTransportRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    console.log(input);
    const { path, ...rest } = input;

    try {
      const conflictingTransportRequest = await db.transportRequest.findFirst({
        where: {
          vehicleId: rest.vehicleId,
          dateAndTimeNeeded: rest.dateAndTimeNeeded,
          request: {
            status: "APPROVED",
          },
        },
      });

      if (conflictingTransportRequest) {
        throw "The vehicle is already booked at the requested date and time.";
      }

      const requestId = `REQ-${generateId(5)}`;
      const transportRequestId = `TRQ-${generateId(5)}`;

      let title;
      try {
        const text = await generateTitle({
          type: input.type,
          inputs: [input.description, input.destination],
        });
        title = text.title || requestId;
      } catch (error) {
        console.error("Error in title generation:", error);
        title = requestId;
      }

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: title,
          departmentId: rest.departmentId,
          transportRequest: {
            create: {
              id: transportRequestId,
              departmentId: rest.department,
              numberOfPassengers: rest.passengersName.length,
              passengersName: rest.passengersName,
              description: rest.description,
              destination: rest.destination,
              dateAndTimeNeeded: rest.dateAndTimeNeeded,
              vehicleId: input.vehicleId,
            },
          },
        },
      });

      const departmentRoleUsers = await db.userRole.findMany({
        where: {
          departmentId: rest.departmentId,
          role: {
            name: {
              in: ["DEPARTMENT_HEAD", "OPERATIONS_MANAGER"],
            },
          },
        },
        include: {
          user: true,
        },
      });

      const recipientIds = departmentRoleUsers.map(
        (roleUser) => roleUser.userId
      );

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Transport Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new transport request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
        recepientIds: [...recipientIds, createdRequest.departmentId],
        userId: user.id,
      });

      await sendEmailNotification({
        recipientIds: recipientIds,
        resourceId: `/request/${createdRequest.id}`,
        title: `New Transport Request: ${createdRequest.title}`,
        payload: `A new transport request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const getPendingReq = authedProcedure
  .createServerAction()
  .input(
    z.object({
      message: z.string().optional(),
    })
  )
  .handler(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const result = await db.request.findMany({
        where: {
          userId: user.id,
          status: "PENDING",
        },
        include: {
          jobRequest: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const getUserReqcount = authedProcedure
  .createServerAction()
  .input(
    z.object({
      message: z.string().optional(),
    })
  )
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    try {
      const result = await db.request.count({
        where: {
          userId: user.id,
        },
      });

      return result;
    } catch (error) {
      getErrorMessage(error);
    }
  });

export async function getManageRequests(input: GetRequestsSchema) {
  await checkAuth();
  const user = await currentUser();
  const {
    page,
    per_page,
    sort,
    title,
    status,
    type,
    priority,
    from,
    to,
    departmentId,
  } = input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      departmentId: departmentId,
      status: {
        in: ["PENDING", "REVIEWED"],
      },
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = { in: type.split(".") };
    }

    if (priority) {
      where.priority = priority;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          user: true,
        },
      }),
      db.request.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getMyRequests(input: GetRequestsSchema) {
  await checkAuth();
  const user = await currentUser();
  const { page, per_page, sort, title, status, type, priority, from, to } =
    input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      userId: user[0]?.id,
      status: { not: "CANCELLED" },
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = { in: type.split(".") };
    }

    if (priority) {
      where.priority = priority;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.request.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export async function getCancelledRequests(input: GetRequestsSchema) {
  const { page, per_page, sort, title, status, type, priority, from, to } =
    input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      status: "CANCELLED",
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (priority) {
      where.priority = priority;
    }

    if (type) {
      where.type = type;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total] = await db.$transaction([
      db.request.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
      }),
      db.request.count({ where }),
    ]);
    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

// export const updateRequest = authedProcedure
//   .createServerAction()
//   .input(extendedUpdateJobRequestSchema)
//   .handler(async ({ input }) => {
//     const { path, id, ...rest } = input;
//     try {
//       const result = await db.request.update({
//         where: {
//           id: id,
//         },
//         data: {
//           ...rest,
//         },
//       });

//       return revalidatePath(path);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   });

export const updateTransportRequest = authedProcedure
  .createServerAction()
  .input(updateTransportRequestSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, id, vehicleStatus, vehicleId, department, ...rest } = input;
    try {
      const result = await db.transportRequest.update({
        where: {
          requestId: id,
        },
        data: {
          vehicle: {
            update: {
              status: vehicleStatus,
            },
          },
          ...rest,
        },
        select: {
          request: {
            select: {
              userId: true,
              title: true,
            },
          },
          requestId: true,
        },
      });

      if (rest.inProgress !== undefined && rest.inProgress) {
        await createNotification({
          resourceId: `/request/${result.requestId}`,
          title: `Transport Request Started: ${result.requestId}`,
          resourceType: "REQUEST",
          notificationType: "INFO",
          message: `Your request for "${result.request.title}" has started. Please ensure that everything is prepared and proceed as scheduled.`,
          userId: user.id,
          recepientIds: [result.request.userId],
        });

        await sendEmailNotification({
          recipientIds: [result.request.userId],
          resourceId: `/request/${result.requestId}`,
          title: `Transport Request Started: ${result.requestId}`,
          payload: `Your request for "${result.request.title}" has started. Please ensure that everything is prepared and proceed as scheduled.`,
        });
      }

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const udpateVenueRequest = authedProcedure
  .createServerAction()
  .input(updateVenueRequestSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, id, venueStatus, venueId, department, ...rest } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        let requestStatus: RequestStatusTypeType | undefined = undefined;
        if (
          rest.approvedByHead !== undefined &&
          rest.approvedByHead === false
        ) {
          requestStatus = "REJECTED" as RequestStatusTypeType;
        }
        const updatedVenueRequest = await prisma.venueRequest.update({
          where: {
            requestId: id,
          },
          data: {
            venue: {
              update: {
                status: venueStatus,
              },
            },
            request: {
              update: {
                status: requestStatus,
              },
            },
            ...rest,
          },
          select: {
            request: {
              select: {
                userId: true,
                title: true,
                departmentId: true,
              },
            },
            requestId: true,
          },
        });

        const departmentRoleUsers = await prisma.userRole.findMany({
          where: {
            departmentId: updatedVenueRequest.request.departmentId,
            role: {
              name: {
                in: ["OPERATIONS_MANAGER"],
              },
            },
          },
          include: {
            user: true,
          },
        });

        const recipientIds = departmentRoleUsers.map(
          (roleUser) => roleUser.userId
        );

        if (
          rest.approvedByHead !== undefined &&
          rest.approvedByHead === false
        ) {
          await createNotification({
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Declined: ${updatedVenueRequest.request.title}`,
            resourceType: "REQUEST",
            notificationType: "WARNING",
            message: `Your venue booking for "${updatedVenueRequest.request.title}" has been declined by the department head. Please contact your department for further clarification.`,
            userId: user.id,
            recepientIds: [updatedVenueRequest.request.userId],
          });

          await sendEmailNotification({
            recipientIds: [updatedVenueRequest.request.userId],
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Declined: ${updatedVenueRequest.request.title}`,
            payload: `Your venue booking for "${updatedVenueRequest.request.title}" has been declined by the department head. Please contact your department for further clarification.`,
          });
        }

        if (rest.approvedByHead !== undefined && rest.approvedByHead === true) {
          await createNotification({
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Approved: ${updatedVenueRequest.request.title}`,
            resourceType: "REQUEST",
            notificationType: "SUCCESS",
            message: `Your venue booking for "${updatedVenueRequest.request.title}" has been approved by the department head..`,
            userId: user.id,
            recepientIds: [updatedVenueRequest.request.userId],
          });

          await sendEmailNotification({
            recipientIds: [updatedVenueRequest.request.userId],
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Approved: ${updatedVenueRequest.request.title}`,
            payload: `Your venue booking for "${updatedVenueRequest.request.title}" has been approved by the department head..`,
          });

          await createNotification({
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Approved: ${updatedVenueRequest.request.title}`,
            resourceType: "REQUEST",
            notificationType: "SUCCESS",
            message: `The venue booking request for "${updatedVenueRequest.request.title}" has been approved by the requester's department head. The booking is now ready for your review and further action if necessary.`,
            userId: user.id,
            recepientIds: [
              ...recipientIds,
              updatedVenueRequest.request.departmentId,
            ],
          });

          await sendEmailNotification({
            recipientIds: [...recipientIds],
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking Approved: ${updatedVenueRequest.request.title}`,
            payload: `The venue booking request for "${updatedVenueRequest.request.title}" has been approved by the requester's department head. The booking is now ready for your review and further action if necessary.`,
          });
        }

        if (rest.inProgress !== undefined && rest.inProgress) {
          await createNotification({
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking In Progress: ${updatedVenueRequest.requestId}`,
            resourceType: "REQUEST",
            notificationType: "INFO",
            message: `Your venue booking for "${updatedVenueRequest.request.title}" is now in progress. Please ensure you arrive on time and follow the booking guidelines.`,
            userId: user.id,
            recepientIds: [updatedVenueRequest.request.userId],
          });

          await sendEmailNotification({
            recipientIds: [updatedVenueRequest.request.userId],
            resourceId: `/request/${updatedVenueRequest.requestId}`,
            title: `Venue Booking In Progress: ${updatedVenueRequest.requestId}`,
            payload: `Your venue booking for "${updatedVenueRequest.request.title}" is now in progress. Please ensure you arrive on time and follow the booking guidelines.`,
          });
        }
        return updatedVenueRequest;
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const udpateReturnableResourceRequest = authedProcedure
  .createServerAction()
  .input(updateReturnableResourceRequestSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, id, itemId, purpose, ...rest } = input;
    try {
      const result = await db.returnableRequest.update({
        where: {
          requestId: id,
        },
        data: {
          purpose: purpose,
          ...rest,
        },
      });

      await Promise.all([
        pusher.trigger("request", "request_update", { message: "" }),
        pusher.trigger("request", "notifications", { message: "" }),
      ]);

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const updateJobRequest = authedProcedure
  .createServerAction()
  .input(updateJobRequestSchemaServerWithPath)
  .handler(async ({ input }) => {
    const { path, id, priority, ...rest } = input;

    try {
      const result = await db.jobRequest.update({
        where: {
          requestId: id,
        },
        data: {
          priority: priority,
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", { message: "" });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const completeVenueRequest = authedProcedure
  .createServerAction()
  .input(updateRequestStatusSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, reviewerId, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedVenueRequest = await prisma.venueRequest.update({
          where: {
            requestId: requestId,
          },
          data: {
            request: {
              update: {
                completedAt: new Date(),
                ...rest,
              },
            },
            inProgress: false,
          },
          include: {
            request: true,
          },
        });

        await db.venue.update({
          where: {
            id: updatedVenueRequest.venueId,
          },
          data: {
            status: "AVAILABLE",
          },
        });

        await createNotification({
          resourceId: `/request/${updatedVenueRequest.requestId}`,
          title: `Request Completed: ${updatedVenueRequest.request.title}`,
          resourceType: "REQUEST",
          notificationType: "SUCCESS",
          message: `Your request titled "${updatedVenueRequest.request.title}" has been successfully completed.`,
          recepientIds: [updatedVenueRequest.request.userId],
          userId: user.id,
        });

        await sendEmailNotification({
          recipientIds: [updatedVenueRequest.request.userId],
          resourceId: `/request/${updatedVenueRequest.requestId}`,
          title: `Request Completed: ${updatedVenueRequest.request.title}`,
          payload: `Your request titled "${updatedVenueRequest.request.title}" has been successfully completed.`,
        });

        return updatedVenueRequest;
      });

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const completeTransportRequest = authedProcedure
  .createServerAction()
  .input(transportRequestActions)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, odometer, ...rest } = input;

    try {
      // Core transaction operations
      const result = await db.$transaction(
        async (prisma) => {
          const transportRequest = await prisma.transportRequest.findUnique({
            where: { requestId },
            select: {
              odometerStart: true,
              vehicleId: true,
              request: {
                select: {
                  userId: true,
                },
              },
            },
          });

          if (!transportRequest || transportRequest.odometerStart === null) {
            throw "Odometer start value is missing or invalid.";
          }

          const totalDistance = parseFloat(
            (odometer - transportRequest.odometerStart).toFixed(2)
          );

          if (totalDistance < 0) {
            throw "Invalid odometer readings. End value must be greater than start value.";
          }

          // Update transport request and vehicle in one transaction
          const updatedTransportRequest = await prisma.transportRequest.update({
            where: { requestId },
            data: {
              request: {
                update: {
                  completedAt: new Date(),
                  ...rest,
                },
              },
              vehicle: {
                update: {
                  odometer,
                  status: "AVAILABLE",
                },
              },
              inProgress: false,
              odometerEnd: odometer,
              totalDistanceTravelled: totalDistance,
            },
          });

          await createNotification({
            resourceId: `/request/${requestId}`,
            title: "Transport Request Completed",
            resourceType: "REQUEST",
            notificationType: "SUCCESS",
            message: `Your transport request has been successfully completed. Please check the request details for more information.`,
            userId: user.id,
            recepientIds: [transportRequest.request.userId],
          });

          await sendEmailNotification({
            recipientIds: [transportRequest.request.userId],
            resourceId: `/request/${requestId}`,
            title: "Transport Request Completed",
            payload: `Your transport request has been successfully completed. Please check the request details for more information.`,
          });

          return {
            updatedTransportRequest,
            vehicleId: transportRequest.vehicleId,
          };
        },
        { timeout: 10000 }
      );

      // Move maintenance check and notification logic outside the transaction
      const { updatedTransportRequest, vehicleId } = result;

      // Fetch vehicle details outside transaction
      const vehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: {
          odometer: true,
          maintenanceInterval: true,
          name: true,
          departmentId: true,
          department: {
            select: {
              userRole: {
                where: {
                  role: { name: "DEPARTMENT_HEAD" },
                },
                select: { userId: true },
              },
            },
          },
        },
      });

      if (vehicle) {
        // Check maintenance status
        const lastMaintenance = await db.maintenanceHistory.findFirst({
          where: { vehicleId },
          orderBy: { createdAt: "desc" },
        });

        const lastMaintenanceOdometer = lastMaintenance?.odometer || 0;
        const nextMaintenanceThreshold =
          lastMaintenanceOdometer + (vehicle.maintenanceInterval || 200000);

        if (vehicle.odometer >= nextMaintenanceThreshold) {
          await db.vehicle.update({
            where: { id: vehicleId },
            data: {
              requiresMaintenance: true,
              status: "UNDER_MAINTENANCE",
            },
          });

          const departmentHeadUserIds =
            vehicle?.department.userRole.map((role) => role.userId) || [];

          if (departmentHeadUserIds.length > 0) {
            await createNotification({
              resourceId: `/department/${vehicle.departmentId}/resources/transport/${vehicleId}`,
              title: `Vehicle Maintenance Required`,
              resourceType: "TASK",
              notificationType: "ALERT",
              message: `The vehicle "${vehicle.name}" requires maintenance. Please address this issue immediately.`,
              userId: user.id,
              recepientIds: [...departmentHeadUserIds, vehicle.departmentId],
            });

            await sendEmailNotification({
              recipientIds: [...departmentHeadUserIds],
              resourceId: `/department/${vehicle.departmentId}/resources/transport/${vehicleId}`,
              title: `Vehicle Maintenance Required`,
              payload: `The vehicle "${vehicle.name}" requires maintenance. Please address this issue immediately.`,
            });
          }

          const futureRequests = await db.transportRequest.findMany({
            where: {
              vehicleId,
              dateAndTimeNeeded: { gte: new Date() }, // Filter for future requests
              request: {
                status: {
                  in: ["APPROVED", "REVIEWED"],
                },
              },
            },
            select: {
              id: true,
              requestId: true,
              dateAndTimeNeeded: true,
              request: {
                select: {
                  userId: true,
                },
              },
            },
          });

          // Notify users about the maintenance and suggest canceling their requests
          for (const request of futureRequests) {
            await createNotification({
              title: "Vehicle Unavailable for Your Transport Request",
              resourceType: "TASK",
              notificationType: "WARNING",
              message: `The vehicle for your transport request on ${request.dateAndTimeNeeded.toLocaleDateString()} is currently under maintenance and its availability is uncertain. We recommend that you review your request and cancel it if possible, as we cannot guarantee when the vehicle will be available.`,
              userId: user.id,
              recepientIds: [request.request.userId],
            });

            await sendEmailNotification({
              recipientIds: [request.request.userId],
              resourceId: `/request/my-requests?page=1&per_page=10&sort=createdAt.desc`,
              title: "Vehicle Unavailable for Your Transport Request",
              payload: `The vehicle for your transport request on ${request.dateAndTimeNeeded.toLocaleDateString()} is currently under maintenance and its availability is uncertain. We recommend that you review your request and cancel it if possible, as we cannot guarantee when the vehicle will be available.`,
            });
          }
        }
      }

      try {
        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
      }

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const assignJobTime = authedProcedure
  .createServerAction()
  .input(
    z.object({
      requestId: z.string(),
      path: z.string(),
      date: z.date(),
    })
  )
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, date } = input;

    try {
      const a = await db.jobRequest.update({
        where: {
          requestId: requestId,
        },
        data: {
          scheduledDateTime: date,
        },
      });
      console.log(a)
      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });
