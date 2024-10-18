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
import { updateRequestStatusSchemaWithPath } from "@/app/(app)/(params)/request/[requestId]/_components/schema";
import { updateReturnableResourceRequestSchemaWithPath } from "../schema/resource/returnable-resource";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

// export const createRequest = authedProcedure
//   .createServerAction()
//   .input(extendedJobRequestSchema)
//   .handler(async ({ ctx, input }) => {
//     const { user } = ctx;

//     const { jobType, path, ...rest } = input;

//     console.log(input)
//     if (!jobType) {
//       throw "Jobtype is undefined";
//     }

//     try {
//       const departments = await db.department.findMany();

//       const { text } = await generateText({
//         model: cohere("command-r-plus"),
//         system: `You are an expert at creating concise, informative titles for work requests.
//                  Your task is to generate clear, action-oriented titles that quickly convey
//                  the nature of the request. Always consider the job type, category, and specific
//                  name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes`,
//         prompt: `Create a clear and concise title for a request based on these details:
//                  Notes:
//                  ${input.type} request
//                  ${input.notes}

//                  Guidelines:
//                  1. Keep it under 50 characters
//                  2. Include the job type, category, and name in the title
//                  3. Capture the main purpose of the request
//                  4. Use action-oriented language
//                  5. Be specific to the request's context
//                  6. Make it easy to understand at a glance
//                  7. Use title case

//                  Example:
//                  If given:
//                  Notes: Fix leaking faucet in the main office bathroom
//                  Job Type: Maintenance
//                  Category: Building
//                  Name: Plumbing

//                  A good title might be:
//                  "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"

//                  Now, create a title for the request using the provided details above.`,
//       });

//       const departmentNames = departments.map((d) => d.name).join(", ");
//       const { text: assignedDepartment } = await generateText({
//         model: cohere("command-r-plus"),
//         system: `You are an AI assistant that assigns departments to job requests based on their description.`,
//         prompt: `Given the following job request description, choose the most appropriate department from this list: ${departmentNames}.
//                  Job description: ${input.notes}
//                  Job Type: ${jobType}

//                  Respond with only the name of the chosen department.`,
//       });

//       const matchedDepartment = departments.find(
//         (d) => d.name.toLowerCase() === assignedDepartment.toLowerCase().trim()
//       );

//       if (!matchedDepartment) {
//         throw "couldn't assign a valid department";
//       }

//       const requestId = `REQ-${generateId(15)}`;
//       const jobRequestId = `JRQ-${generateId(15)}`;

//       const request = await db.request.create({
//         data: {
//           id: requestId,
//           userId: user.id,
//           priority: rest.priority,
//           type: rest.type,
//           title: text,
//           department: rest.department,
//           jobRequest: {
//             create: {
//               id: jobRequestId,
//               notes: rest.notes,
//               dueDate: rest.dueDate,
//               jobType: jobType,
//               assignTo: matchedDepartment.name,
//               files: {
//                 create: rest.images?.map((fileName) => ({
//                   id: `JRQ-${generateId(15)}`,
//                   url: fileName,
//                 })),
//               },
//             },
//           },
//         },
//       });

//       return revalidatePath(path);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   });

export const createVenueRequest = authedProcedure
  .createServerAction()
  .input(extendedVenueRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;

    const { path, ...rest } = input;

    try {
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

      const requestId = `REQ-${generateId(15)}`;
      const venuRequestId = `VRQ-${generateId(15)}`;

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

      const requestId = `REQ-${generateId(15)}`;
      const transportRequestId = `TRQ-${generateId(15)}`;

      await db.request.create({
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

export async function getManageRequests(
  input: GetRequestsSchema & { departmentId: string }
) {
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
    const { path, id, ...rest } = input;
    try {
      const result = await db.transportRequest.update({
        where: {
          requestId: id,
        },
        data: {
          ...rest,
        },
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
  .input(updateRequestStatusSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, reviewerId, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedTransportRequest = await prisma.transportRequest.update({
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
        });

        await db.vehicle.update({
          where: {
            id: updatedTransportRequest.vehicleId,
          },
          data: {
            status: "AVAILABLE",
          },
        });

        return updatedTransportRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
