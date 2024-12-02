import { logger, schedules, wait } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid';
import { pusher } from "@/lib/pusher";

const prisma = new PrismaClient();

export const returnableRequestTask = schedules.task({
  id: "returnable-request-checker",
  cron: "* * * * *", // Run every minute
  maxDuration: 300, // 5 minutes max duration
  run: async (payload, { ctx }) => {
    const now = new Date();
    logger.log("Starting returnable request check", { timestamp: now });

    try {

      // Find potentially overdue requests
      const returnableRequests = await prisma.returnableRequest.findMany({
        where: {
          returnDateAndTime: {
            lt: now,
          },
          isReturned: false,
          inProgress: true,
          isOverdue: false,
          request: {
            status: "APPROVED",
          },
        },
        include: {
          request: {
            include: {
              department: true,
              user: true,
            },
          },
        },
      });

      // Filter and map overdue request IDs
      const overdueRequestIds = returnableRequests
        .filter((request) => now > request.returnDateAndTime)
        .map((request) => request.id);

      if (overdueRequestIds.length > 0) {
        // Mark requests as overdue
        await prisma.returnableRequest.updateMany({
          where: {
            id: { in: overdueRequestIds },
          },
          data: {
            isOverdue: true,
          },
        });

        // Create notifications for each overdue request
        for (const request of returnableRequests) {
          if (request.request.reviewedBy) {
            // Notification for the user
            await prisma.notification.create({
              data: {
                id: nanoid(5),
                userId: request.request.reviewedBy,
                recepientId: request.request.user.id,
                resourceId: `/request/${request.requestId}`,
                title: `Overdue Request: ${request.request.title}`,
                resourceType: "REQUEST",
                notificationType: "WARNING",
                message: `The borrow request titled "${request.request.title}" is overdue. Please return the item as soon as possible.`,
              },
            });

            // Notification for the department
            await prisma.notification.create({
              data: {
                id: nanoid(5),
                userId: request.request.reviewedBy,
                recepientId: request.request.departmentId,
                resourceId: `/request/${request.requestId}`,
                title: `Overdue Request: ${request.request.title}`,
                resourceType: "REQUEST",
                notificationType: "REMINDER",
                message: `The borrow request titled "${request.request.title}" is overdue. Please take immediate action to ensure the item is returned promptly.`,
              },
            });
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

        logger.log("Processed overdue requests", { 
          overdueCount: overdueRequestIds.length,
          notificationsCreated: overdueRequestIds.length * 2 
        });
      }

    } catch (error) {
      logger.error("Error processing returnable requests", { error });
      throw error; // Rethrow to ensure trigger.dev knows the task failed
    }
  },
});