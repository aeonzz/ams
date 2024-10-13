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
  cancelOwnRequestSchema,
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

      const createdReaquest = await db.request.create({
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

      await createNotification({
        resourceId: `/request/${createdReaquest.id}`,
        title: `New Request Assigned: ${createdReaquest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new request titled "${createdReaquest.title}" has been assigned to your department. Please review the request for further details.`,
        recepientIds: [createdReaquest.departmentId],
        userId: user.id,
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
          include: {
            jobRequest: true,
            department: {
              include: {
                userRole: {
                  where: {
                    role: {
                      name: "DEPARTMENT_HEAD",
                    },
                  },
                  select: {
                    user: true,
                    role: true,
                  },
                },
              },
            },
          },
        });

        const departmentHeads = updatedRequest.department.userRole
          ?.filter((role) => role.role.name === "DEPARTMENT_HEAD")
          .map((role) => role.user.id);

        if (rest.status === "REVIEWED") {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Request Reviewed: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "APPROVAL",
            message: `The request titled "${updatedRequest.title}" has been reviewed and is awaiting your approval. Please review the details and take the necessary actions.`,
            userId: user.id,
            recepientIds: departmentHeads,
          });
        }

        if (rest.status === "APPROVED") {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Request Approved: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "SUCCESS",
            message: `Congratulations! Your request for "${updatedRequest.title}" has been approved. Please check the request for further details.`,
            userId: user.id,
            recepientIds: [updatedRequest.userId],
          });

          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Request Approved: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "APPROVAL",
            message: `The request titled "${updatedRequest.title}" has been approved. Please check the request for further details.`,
            userId: user.id,
            recepientIds: [updatedRequest.departmentId],
          });

          if (
            updatedRequest.type === "JOB" &&
            updatedRequest.jobRequest?.assignedTo
          ) {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `New Job Assignment: ${updatedRequest.title}`,
              resourceType: "TASK",
              notificationType: "REMINDER",
              message: `You have been assigned to a new job: ${updatedRequest.title}. Please review the details and take the necessary actions.`,
              userId: user.id,
              recepientIds: [updatedRequest.jobRequest?.assignedTo],
            });
          }
        }

        if (rest.status === "CANCELLED") {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              resourceId: `/request/${updatedRequest.id}`,
              userId: user.id,
              resourceType: "REQUEST",
              recepientId: updatedRequest.userId,
              title: `Request Cancelled: ${updatedRequest.title}`,
            },
          });

          if (!existingNotification) {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `Request Cancelled: ${updatedRequest.title}`,
              resourceType: "REQUEST",
              notificationType: "WARNING",
              message: `Your request for "${updatedRequest.title}" has been cancelled. Please check the request for further details.`,
              userId: user.id,
              recepientIds: [updatedRequest.userId],
            });
          }
        }

        // if (rest.status === "COMPLETED") {
        //   const existingNotification = await prisma.notification.findFirst({
        //     where: {
        //       resourceId: `/request/${updatedRequest.id}`,
        //       userId: user.id,
        //       resourceType: "REQUEST",
        //       recepientId: updatedRequest.userId,
        //       title: `Request Completed: ${updatedRequest.title}`,
        //     },
        //   });

        //   if (!existingNotification) {
        //     await createNotification({
        //       resourceId: `/request/${updatedRequest.id}`,
        //       title: `Request Completed: ${updatedRequest.title}`,
        //       resourceType: "REQUEST",
        //       message: `Your request for "${updatedRequest.title}" has been successfully completed. Please review the final details.`,
        //       userId: user.id,
        //       recepientIds: [updatedRequest.userId],
        //     });
        //   }
        // }

        return updatedRequest;
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const cancelOwnRequest = authedProcedure
  .createServerAction()
  .input(cancelOwnRequestSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedRequest = await prisma.request.update({
          where: { id: requestId },
          data: {
            ...rest,
          },
          include: { jobRequest: true },
        });
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
    const { path, requestId, status, ...rest } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedRequest = await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            jobRequest: {
              update: {
                status: status,
                ...rest,
              },
            },
            completedAt: status === "VERIFIED" ? new Date() : undefined,
          },
          include: {
            jobRequest: true,
          },
        });

        if (status === "IN_PROGRESS" && updatedRequest.reviewedBy) {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Job In Progress: ${updatedRequest.title}`,
            resourceType: "TASK",
            notificationType: "INFO",
            message: `The job for "${updatedRequest.title}" is currently in progress. Please check the request for further details.`,
            recepientIds: [
              updatedRequest.reviewedBy,
              updatedRequest.departmentId,
            ],
            userId: user.id,
          });

          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Job In Progress: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "INFO",
            message: `Your job request for "${updatedRequest.title}" is currently in progress. Please check the request for further details.`,
            recepientIds: [updatedRequest.userId],
            userId: user.id,
          });
        }

        if (status === "COMPLETED" && updatedRequest.reviewedBy) {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Job Completed: ${updatedRequest.title}`,
            resourceType: "TASK",
            notificationType: "SUCCESS",
            message: `The job for "${updatedRequest.title}" has been successfully completed. Please review the request for further details.`,
            recepientIds: [
              updatedRequest.reviewedBy,
              updatedRequest.departmentId,
            ],
            userId: user.id,
          });
        }

        if (status === "VERIFIED" && updatedRequest.jobRequest?.assignedTo) {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Job Verified: ${updatedRequest.title}`,
            resourceType: "TASK",
            notificationType: "APPROVAL",
            message: `Your work on the job request "${updatedRequest.title}" has been successfully verified and completed.`,
            recepientIds: [updatedRequest.jobRequest.assignedTo],
            userId: user.id,
          });

          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Job Request Completed: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "SUCCESS",
            message: `Your job request for "${updatedRequest.title}" has been successfully completed. Thank you for your patience! Please review the request for any further details.`,
            userId: user.id,
            recepientIds: [updatedRequest.userId],
          });
        }

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
    const { user } = ctx;
    const { id, status, rejectionReason } = input;
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
          include: {
            request: true,
          },
        });

        await prisma.rework.create({
          data: {
            id: generateId(15),
            jobRequestId: updateJobRequestStatus.id,
            rejectionReason: rejectionReason,
          },
        });

        if (updateJobRequestStatus.assignedTo) {
          await createNotification({
            resourceId: `/request/${updateJobRequestStatus.requestId}`,
            title: `Job Rejected: ${updateJobRequestStatus.request.title}`,
            resourceType: "TASK",
            notificationType: "ALERT",
            message: `The job for "${updateJobRequestStatus.request.title}" has been rejected after review. Specific issues were identified, and a rework is required to meet the necessary standards. Please check the request for detailed feedback and instructions on the next steps.`,
            recepientIds: [updateJobRequestStatus.assignedTo],
            userId: user.id,
          });

          await createNotification({
            resourceId: `/request/${updateJobRequestStatus.requestId}`,
            title: `Job Rejected: ${updateJobRequestStatus.request.title}`,
            resourceType: "REQUEST",
            notificationType: "INFO",
            message: `Your job request for "${updateJobRequestStatus.request.title}" has been rejected and requires a rework. Please check the request for further details on the changes needed.`,
            recepientIds: [updateJobRequestStatus.request.userId],
            userId: user.id,
          });
        }

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
    const { user } = ctx;
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
          select: {
            jobRequest: {
              select: {
                request: true,
              },
            },
          },
        });

        if (
          status === "REWORK_IN_PROGRESS" &&
          updateJobRequestStatus.jobRequest.request.reviewedBy
        ) {
          await createNotification({
            resourceId: `/request/${updateJobRequestStatus.jobRequest.request.id}`,
            title: `Rework In Progress: ${updateJobRequestStatus.jobRequest.request.title}`,
            resourceType: "TASK",
            notificationType: "INFO",
            message: `The rework for "${updateJobRequestStatus.jobRequest.request.title}" job is currently in progress. Please check the request for further details.`,
            recepientIds: [
              updateJobRequestStatus.jobRequest.request.reviewedBy,
            ],
            userId: user.id,
          });

          await createNotification({
            resourceId: `/request/${updateJobRequestStatus.jobRequest.request.id}`,
            title: `Rework In Progress: ${updateJobRequestStatus.jobRequest.request.title}`,
            resourceType: "REQUEST",
            notificationType: "INFO",
            message: `Your job request for "${updateJobRequestStatus.jobRequest.request.title}" is currently under rework. Please check the request for further details.`,
            recepientIds: [updateJobRequestStatus.jobRequest.request.userId],
            userId: user.id,
          });
        }

        if (
          status === "COMPLETED" &&
          updateJobRequestStatus.jobRequest.request.reviewedBy
        ) {
          await createNotification({
            resourceId: `/request/${updateJobRequestStatus.jobRequest.request.id}`,
            title: `Rework Completed: ${updateJobRequestStatus.jobRequest.request.title}`,
            resourceType: "TASK",
            notificationType: "SUCCESS",
            message: `The rework for the request "${updateJobRequestStatus.jobRequest.request.title}" has been successfully completed. Please review the request for further details.`,
            recepientIds: [
              updateJobRequestStatus.jobRequest.request.reviewedBy,
            ],
            userId: user.id,
          });
        }

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
