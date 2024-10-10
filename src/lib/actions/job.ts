"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { type GetJobSectionSchema } from "../schema";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { extendedJobRequestSchemaServer } from "../db/schema/job";
import {
  assignPersonnelSchemaWithPath,
  reworkJobRequestSchema,
  updateJobRequestSchemaWithPath,
  updateRequestStatusSchemaWithPath,
  updateReworkJobRequestSchema,
} from "@/app/(app)/(params)/request/[requestId]/_components/schema";
import { createNotification } from "./notification";

export const createJobRequest = authedProcedure
  .createServerAction()
  .input(extendedJobRequestSchemaServer)
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
               ${input.description}
               ${input.jobType}

               
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

      const createRequest = await db.request.create({
        data: {
          id: `REQ-${generateId(15)}`,
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
          departmentId: rest.departmentId,
          jobRequest: {
            create: {
              id: `JRQ-${generateId(15)}`,
              description: rest.description,
              dueDate: rest.dueDate,
              location: rest.location,
              jobType: rest.jobType,
              files: {
                create: rest.images?.map((fileName) => ({
                  id: `JRQ-${generateId(15)}`,
                  url: fileName,
                })),
              },
            },
          },
        },
        include: {
          jobRequest: true,
          department: true,
        },
      });

      if (!createRequest.jobRequest) {
        throw "Something went wrong, please try again later.";
      }

      const newValueJson = JSON.parse(JSON.stringify(createRequest));
      await db.genericAuditLog.create({
        data: {
          id: generateId(15),
          entityId: createRequest.id,
          entityType: "JOB_REQUEST",
          changeType: "CREATED",
          newValue: newValueJson,
          changedById: user.id,
        },
      });

      await createNotification({
        resourceId: createRequest.id,
        title: "New Job Request",
        message: `There is a new job request for ${createRequest.department.name}}`,
        departmentId: rest.departmentId,
      });

      return revalidatePath(path);
    } catch (error) {
      getErrorMessage(error);
    }
  });

export const assignPersonnel = authedProcedure
  .createServerAction()
  .input(assignPersonnelSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { path, requestId, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const currentRequest = await prisma.request.findUnique({
          where: {
            id: requestId,
          },
          include: {
            jobRequest: true,
          },
        });

        if (!currentRequest) {
          throw "Request not found";
        }

        const updatedRequest = await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            jobRequest: {
              update: {
                assignedTo: rest.personnelId,
              },
            },
          },
          include: {
            jobRequest: true,
          },
        });

        const oldValueJson = JSON.parse(JSON.stringify(currentRequest));
        const newValueJson = JSON.parse(JSON.stringify(updatedRequest));

        await prisma.genericAuditLog.create({
          data: {
            id: generateId(15),
            entityId: requestId,
            changeType: "ASSIGNMENT_CHANGE",
            entityType: "JOB_REQUEST",
            oldValue: oldValueJson,
            newValue: newValueJson,
            changedById: user.id,
          },
        });

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateRequestStatus = authedProcedure
  .createServerAction()
  .input(updateRequestStatusSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, reviewerId, changeType, entityType, ...rest } =
      input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedRequest = await prisma.request.update({
          where: { id: requestId },
          data: {
            ...rest,
            reviewedBy: reviewerId,
          },
          include: { jobRequest: true },
        });

        if (
          rest.status === "APPROVED" &&
          updatedRequest.type === "JOB" &&
          updatedRequest.jobRequest?.assignedTo
        ) {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              resourceId: `/request/${updatedRequest.id}`,
              userId: updatedRequest.jobRequest?.assignedTo,
              title: `New Job Assignment: ${updatedRequest.title}`,
            },
          });

          if (!existingNotification) {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `New Job Assignment: ${updatedRequest.title}`,
              message: `You have been assigned to a new job: ${updatedRequest.title}. Please review the details and take the necessary actions.`,
              userId: updatedRequest.jobRequest?.assignedTo,
            });
          }
        }

        if (rest.status === "CANCELLED") {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              resourceId: `/request/${updatedRequest.id}`,
              userId: updatedRequest.userId,
              title: `Request Cancelled: ${updatedRequest.title}`,
            },
          });

          if (!existingNotification) {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `Request Cancelled: ${updatedRequest.title}`,
              message: `Your request for "${updatedRequest.title}" has been cancelled. Please check the request for further details.`,
              userId: updatedRequest.userId,
            });
          }
        }

        if (rest.status === "COMPLETED") {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              resourceId: `/request/${updatedRequest.id}`,
              userId: updatedRequest.userId,
              title: `Request Completed: ${updatedRequest.title}`,
            },
          });

          if (!existingNotification) {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `Request Completed: ${updatedRequest.title}`,
              message: `Your request for "${updatedRequest.title}" has been successfully completed. Please review the final details.`,
              userId: updatedRequest.userId,
            });
          }
        }

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateJobRequest = authedProcedure
  .createServerAction()
  .input(updateJobRequestSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const currentRequest = await prisma.request.findUnique({
          where: {
            id: requestId,
          },
          include: {
            jobRequest: true,
          },
        });

        if (!currentRequest) {
          throw "Request not found";
        }

        const updatedRequest = await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            jobRequest: {
              update: {
                ...rest,
              },
            },
          },
          include: {
            jobRequest: true,
          },
        });
        const oldValueJson = JSON.parse(JSON.stringify(currentRequest));
        const newValueJson = JSON.parse(JSON.stringify(updatedRequest));
        await prisma.genericAuditLog.create({
          data: {
            id: generateId(15),
            entityId: requestId,
            entityType: "JOB_REQUEST",
            changeType: "FIELD_UPDATE",
            oldValue: oldValueJson,
            newValue: newValueJson,
            changedById: user.id,
          },
        });

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const reworkJobRequest = authedProcedure
  .createServerAction()
  .input(reworkJobRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { id, status, rejectionReason, ...rest } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        const updateJobRequestStatus = await db.jobRequest.update({
          where: {
            requestId: id,
          },
          data: {
            status: status,
            rejectionCount: {
              increment: 1,
            },
          },
        });

        await prisma.rework.create({
          data: {
            id: generateId(15),
            jobRequestId: updateJobRequestStatus.id,
            rejectionReason: rejectionReason,
          },
        });

        return updateJobRequestStatus;
      });

      return result;
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const updateReworkJobRequest = authedProcedure
  .createServerAction()
  .input(updateReworkJobRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { reworkId, status, ...rest } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        const updateJobRequestStatus = await db.rework.update({
          where: {
            id: reworkId,
          },
          data: {
            jobRequest: {
              update: {
                status: status,
              },
            },
            ...rest,
          },
        });

        return updateJobRequestStatus;
      });

      return result;
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

// export const assignSection = authedProcedure
//   .createServerAction()
//   .input(assignUserSchemaWithPath)
//   .handler(async ({ input }) => {
//     const { path, userId, ...rest } = input;
//     try {
//       const user = await db.user.findUnique({
//         where: {
//           id: userId,
//         },
//         select: {
//           sectionId: true,
//         },
//       });

//       if (user && user.sectionId !== null) {
//         throw "User already assigned to a section";
//       }

//       await db.user.update({
//         where: {
//           id: userId,
//         },
//         data: {
//           ...rest,
//         },
//       });
//       revalidatePath(path);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   });

// export const unassignSection = authedProcedure
//   .createServerAction()
//   .input(unassignUserWithPath)
//   .handler(async ({ input }) => {
//     const { path, userId } = input;
//     try {
//       await db.user.update({
//         where: {
//           id: userId,
//         },
//         data: {
//           sectionId: null,
//         },
//       });
//       revalidatePath(path);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   });
