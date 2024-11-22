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

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export async function getRequests(input: GetRequestsSchema) {
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

      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: 
                 ${input.type} request
                 ${input.notes}
                 ${rest.purpose}

                 
                 Guidelines:
                 1. Keep it under 50 characters
                 2. Include the job type, category, and name in the title
                 3. Capture the main purpose of the request
                 4. Use action-oriented language
                 5. Be specific to the request's context
                 6. Make it easy to understand at a glance
                 7. Use title case
                 
                 Example: 
                 If given:
                 Notes: Fix leaking faucet in the main office bathroom
                 Job Type: Maintenance
                 Category: Building
                 Name: Plumbing
                 
                 A good title might be:
                 "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
                 
                 Now, create a title for the request using the provided details above.`,
      });

      if (!text || text.trim().length === 0) {
        throw "Something went wrong while generating the request title. Please check your internet connection or try again.";
      }

      const requestId = `REQ-${generateId(3)}`;
      const venuRequestId = `VRQ-${generateId(3)}`;

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
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
            },
          },
        },
        include: {
          venueRequest: true,
        },
      });

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Venue Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new venue request titled "${createdRequest.title}" has been submitted. Please check the details and proceed with the necessary actions.`,
        recepientIds: [createdRequest.departmentId],
        userId: user.id,
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
        },
      });

      if (conflictingTransportRequest) {
        throw "The vehicle is already booked at the requested date and time.";
      }

      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: `You are an expert at creating concise, informative titles for work requests. 
                 Your task is to generate clear, action-oriented titles that quickly convey 
                 the nature of the request. Always consider the job type, category, and specific 
                 name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
        prompt: `Create a clear and concise title for a request based on these details:
                 Notes: 
                 ${input.type} request
                 ${input.description}
                 ${input.destination}

                 
                 Guidelines:
                 1. Keep it under 50 characters
                 2. Include the job type, category, and name in the title
                 3. Capture the main purpose of the request
                 4. Use action-oriented language
                 5. Be specific to the request's context
                 6. Make it easy to understand at a glance
                 7. Use title case
                 
                 Example: 
                 If given:
                 Notes: Fix leaking faucet in the main office bathroom
                 Job Type: Maintenance
                 Category: Building
                 Name: Plumbing
                 
                 A good title might be:
                 "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
                 
                 Now, create a title for the request using the provided details above.`,
      });

      if (!text || text.trim().length === 0) {
        throw "Something went wrong while generating the request title. Please check your internet connection or try again.";
      }

      const requestId = `REQ-${generateId(3)}`;
      const transportRequestId = `TRQ-${generateId(3)}`;

      const createdRequest = await db.request.create({
        data: {
          id: requestId,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
          departmentId: rest.departmentId,
          transportRequest: {
            create: {
              id: transportRequestId,
              department: rest.department,
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

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Job Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new transport request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
        recepientIds: [createdRequest.departmentId],
        userId: user.id,
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
  .handler(async ({ input }) => {
    const { path, id, vehicleStatus, vehicleId, ...rest } = input;
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
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const udpateVenueRequest = authedProcedure
  .createServerAction()
  .input(updateVenueRequestSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, id, ...rest } = input;
    try {
      const result = await db.venueRequest.update({
        where: {
          requestId: id,
        },
        data: {
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

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
    const { path, id, ...rest } = input;

    try {
      const result = await db.jobRequest.update({
        where: {
          requestId: id,
        },
        data: {
          ...rest,
        },
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

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
            actualEndtime: new Date(),
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

        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);

        return updatedVenueRequest;
      });

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
            select: { odometerStart: true, vehicleId: true },
          });

          if (!transportRequest || transportRequest.odometerStart === null) {
            throw "Odometer start value is missing or invalid.";
          }

          const totalDistance = parseFloat(
            (odometer - transportRequest.odometerStart).toFixed(2)
          );

          console.log(totalDistance, odometer, transportRequest.odometerStart);

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
          orderBy: { performedAt: "desc" },
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

          const departmentHeadUserId = vehicle.department.userRole[0]?.userId;
          if (departmentHeadUserId) {
            await createNotification({
              resourceId: `/department/${vehicle.departmentId}/resources/transport/${vehicleId}`,
              title: `Vehicle Maintenance Required`,
              resourceType: "TASK",
              notificationType: "ALERT",
              message: `The vehicle "${vehicle.name}" requires maintenance. Please address this issue immediately.`,
              userId: user.id,
              recepientIds: [vehicle.departmentId, departmentHeadUserId],
            });
          }

          const futureRequests = await db.transportRequest.findMany({
            where: {
              vehicleId,
              dateAndTimeNeeded: { gte: new Date() }, // Filter for future requests
              request: {
                status: "APPROVED",
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
              recepientIds: [request.request.userId], // Send to the requester
            });
          }
        }
      }

      // Trigger pusher events outside transaction
      await Promise.all([
        pusher.trigger("request", "request_update", { message: "" }),
        pusher.trigger("request", "notifications", { message: "" }),
      ]);

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
