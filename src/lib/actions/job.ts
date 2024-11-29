"use server";

import { generateId } from "lucia";
import { authedProcedure, getErrorMessage } from "./utils";

import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { cohere } from "@ai-sdk/cohere";
import {
  extendedJobRequestSchemaServer,
  uploadProofImagesSchemaWithPath,
} from "../db/schema/job";
import { createNotification } from "./notification";
import {
  assignPersonnelSchemaWithPath,
  cancelRequestSchema,
  reworkJobRequestSchema,
  updateJobRequestSchemaWithPath,
  updateRequestStatusSchemaWithPath,
  updateReworkJobRequestSchema,
  verifyJobSchema,
} from "@/app/(app)/request/[requestId]/_components/schema";
import { pusher } from "../pusher";
import { checkAuth } from "../auth/utils";
import { GetRequestsSchema } from "../schema";
import { formatFullName } from "../utils";
import { PrismaClient } from "@prisma/client";

const generateDateId = async (db: PrismaClient) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const latestRequest = await db.request.findFirst({
    where: {
      id: {
        startsWith: `${year}-${month}-`,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  let sequence = 1;
  if (latestRequest) {
    const lastSequence = parseInt(latestRequest.id.split("-")[2]);
    sequence = lastSequence + 1;
  }

  return `${year}-${month}-${String(sequence).padStart(3, "0")}`;
};

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

      if (!text || text.trim().length === 0) {
        throw "Something went wrong while generating the request title. Please check your internet connection or try again.";
      }

      const createdRequest = await db.request.create({
        data: {
          id: await generateDateId(db),
          userId: user.id,
          priority: rest.priority,
          type: rest.type,
          title: text,
          departmentId: rest.departmentId,
          jobRequest: {
            create: {
              id: generateId(5),
              department: rest.department,
              description: rest.description,
              location: rest.location,
              jobType: rest.jobType,
              images: rest.images,
            },
          },
        },
        include: {
          jobRequest: true,
          department: true,
        },
      });

      await createNotification({
        resourceId: `/request/${createdRequest.id}`,
        title: `New Job Request: ${createdRequest.title}`,
        resourceType: "REQUEST",
        notificationType: "INFO",
        message: `A new job request titled "${createdRequest.title}" has been submitted. Please review the details and take the necessary actions.`,
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

export const assignPersonnel = authedProcedure
  .createServerAction()
  .input(assignPersonnelSchemaWithPath)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { path, requestId, status, ...rest } = input;
    try {
      const result = await db.$transaction(async (prisma) => {
        const existingRequest = await prisma.request.findUnique({
          where: { id: requestId },
          include: { jobRequest: true },
        });

        if (!existingRequest) {
          return "Job request not found";
        }

        const isReassigned: boolean =
          !!existingRequest.jobRequest?.assignedTo &&
          existingRequest.jobRequest.assignedTo !== rest.personnelId;

        const updatedRequest = await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            jobRequest: {
              update: {
                assignedTo: rest.personnelId,
                isReassigned,
              },
            },
          },
          include: {
            jobRequest: true,
          },
        });

        if (status === "APPROVED" && isReassigned) {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `New Job Assignment: ${updatedRequest.title}`,
            resourceType: "TASK",
            notificationType: "REMINDER",
            message: `You have been assigned to a new job: ${updatedRequest.title}. Please review the details and take the necessary actions.`,
            userId: user.id,
            recepientIds: [rest.personnelId],
          });
        }

        return updatedRequest;
      });

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

export const updateRequestStatus = authedProcedure
  .createServerAction()
  .input(updateRequestStatusSchemaWithPath)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, requestId, reviewerId, ...rest } = input;

    try {
      const result = await db.$transaction(
        async (prisma) => {
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
              message: `Your request for "${updatedRequest.title}" has been approved! Visit the request page for details and next steps.`,
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

          if (rest.status === "REJECTED") {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `Request Rejected: ${updatedRequest.title}`,
              resourceType: "REQUEST",
              notificationType: "WARNING",
              message: `Your request for "${updatedRequest.title}" has been rejected. Please check the request for further details.`,
              userId: user.id,
              recepientIds: [updatedRequest.userId],
            });
          }

          if (rest.status === "ON_HOLD") {
            await createNotification({
              resourceId: `/request/${updatedRequest.id}`,
              title: `Request On Hold: ${updatedRequest.title}`,
              resourceType: "REQUEST",
              notificationType: "WARNING",
              message: `Your request for "${updatedRequest.title}" is currently on hold. Please review the request for further details and take the necessary actions.`,
              userId: user.id,
              recepientIds: [updatedRequest.userId],
            });
          }

          return updatedRequest;
        },
        { timeout: 10000 }
      );

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

export const cancelRequest = authedProcedure
  .createServerAction()
  .input(cancelRequestSchema)
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
        });

        if (rest.cancellationReason) {
          await createNotification({
            resourceId: `/request/${updatedRequest.id}`,
            title: `Request Cancelled: ${updatedRequest.title}`,
            resourceType: "REQUEST",
            notificationType: "ALERT",
            message: `Your request for "${updatedRequest.title}" has been cancelled. Please contact support or the relevant authority if you need further assistance.`,
            userId: user.id,
            recepientIds: [updatedRequest.userId],
          });
        }

        await pusher.trigger("request", "request_update", {
          message: "",
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

        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);

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
            id: generateId(3),
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

        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);

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

        await Promise.all([
          pusher.trigger("request", "request_update", { message: "" }),
          pusher.trigger("request", "notifications", { message: "" }),
        ]);

        return updateJobRequestStatus;
      });

      return result;
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export const completeJobRequest = authedProcedure
  .createServerAction()
  .input(verifyJobSchema)
  .handler(async ({ ctx, input }) => {
    const { user } = ctx;
    const { path, jobRequestId, verify, role } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedData = await db.jobRequest.update({
          where: { id: jobRequestId },
          data:
            role === "reviewer"
              ? { verifiedByReviewer: verify }
              : { verifiedByRequester: verify },
          select: {
            id: true,
            verifiedByReviewer: true,
            verifiedByRequester: true,
          },
        });

        if (updatedData.verifiedByReviewer && updatedData.verifiedByRequester) {
          await db.jobRequest.update({
            where: {
              id: jobRequestId,
            },
            data: {
              request: {
                update: {
                  status: "COMPLETED",
                  completedAt: new Date(),
                },
              },
            },
          });
        }

        return updatedData;
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });

export async function getDepartmentJobRequests(input: GetRequestsSchema) {
  await checkAuth();
  const { page, per_page, sort, from, title, status, to, departmentId, id } =
    input;

  try {
    const skip = (page - 1) * per_page;

    const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
      keyof Request | undefined,
      "asc" | "desc" | undefined,
    ];

    const where: any = {
      request: {
        departmentId: departmentId,
      },
    };

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (id) {
      where.requestId = id;
    }

    if (status) {
      where.status = status;
    }

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const [data, total, department] = await db.$transaction([
      db.jobRequest.findMany({
        where,
        take: per_page,
        skip,
        orderBy: {
          [column || "createdAt"]: order || "desc",
        },
        include: {
          request: {
            include: {
              user: true,
              reviewer: true,
            },
          },
        },
      }),
      db.jobRequest.count({ where }),
      db.department.findUnique({
        where: {
          id: departmentId,
        },
        select: {
          name: true,
        },
      }),
    ]);
    const pageCount = Math.ceil(total / per_page);

    const formattedData = data.map((data) => {
      const { request, id, createdAt, updatedAt, ...rest } = data;
      return {
        ...rest,
        id: request.id,
        completedAt: request.completedAt,
        title: request.title,
        requester: formatFullName(
          request.user.firstName,
          request.user.middleName,
          request.user.lastName
        ),
        reviewer: request.reviewer
          ? formatFullName(
              request.reviewer.firstName,
              request.reviewer.middleName,
              request.reviewer.lastName
            )
          : undefined,
        requestStatus: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      };
    });

    return { data: formattedData, pageCount, department };
  } catch (err) {
    console.error(err);
    return { data: [], pageCount: 0 };
  }
}

export const uploadProofImages = authedProcedure
  .createServerAction()
  .input(uploadProofImagesSchemaWithPath)
  .handler(async ({ input }) => {
    const { path, proofImages, requestId } = input;

    try {
      const result = await db.$transaction(async (prisma) => {
        const updatedData = await db.jobRequest.update({
          where: {
            requestId: requestId,
          },
          data: {
            proofImages: proofImages,
          },
        });

        return updatedData;
      });

      await pusher.trigger("request", "request_update", {
        message: "",
      });

      return revalidatePath(path);
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
