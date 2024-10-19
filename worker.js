import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import WebSocket, { WebSocketServer } from "ws";
import crypto from "crypto";

const prisma = new PrismaClient();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

function generateId(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

async function updateInProgressStatus() {
  const now = new Date();
  console.log(now);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Update TransportRequests
      const updatedTransportRequests = await prisma.transportRequest.updateMany(
        {
          where: {
            dateAndTimeNeeded: {
              lte: now,
            },
            inProgress: false,
            request: {
              status: "APPROVED",
            },
          },
          data: {
            inProgress: true,
          },
        }
      );

      if (updatedTransportRequests.count > 0) {
        const vehicleIds = await prisma.transportRequest.findMany({
          where: {
            dateAndTimeNeeded: {
              lte: now,
            },
            inProgress: true,
            request: {
              status: "APPROVED",
            },
          },
          select: {
            vehicleId: true,
          },
        });

        const vehicleIdsArray = vehicleIds.map((v) => v.vehicleId);
        await prisma.vehicle.updateMany({
          where: {
            id: { in: vehicleIdsArray },
          },
          data: {
            status: "IN_USE",
          },
        });
      }

      // Update VenueRequests
      const updatedVenueRequests = await prisma.venueRequest.updateMany({
        where: {
          startTime: {
            lte: now,
          },
          endTime: {
            gt: now,
          },
          inProgress: false,
          request: {
            status: "APPROVED",
          },
        },
        data: {
          inProgress: true,
        },
      });

      if (updatedVenueRequests.count > 0) {
        const venueIds = await prisma.venueRequest.findMany({
          where: {
            startTime: {
              lte: now,
            },
            endTime: {
              gt: now,
            },
            inProgress: true,
            request: {
              status: "APPROVED",
            },
          },
          select: {
            venueId: true,
          },
        });

        const venueIdsArray = venueIds.map((v) => v.venueId);
        await prisma.venue.updateMany({
          where: {
            id: { in: venueIdsArray },
          },
          data: {
            status: "IN_USE",
          },
        });
      }

      const updatedReturnableRequests =
        await prisma.returnableRequest.updateMany({
          where: {
            dateAndTimeNeeded: {
              lte: now,
            },
            returnDateAndTime: {
              gt: now,
            },
            inProgress: false,
            request: {
              status: "APPROVED",
            },
          },
          data: {
            inProgress: true,
          },
        });

      const overdueReturnableRequests =
        await prisma.returnableRequest.updateMany({
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
          data: {
            isOverdue: true,
          },
        });

      if (overdueReturnableRequests.count > 0) {
        const updatedRequests = await prisma.returnableRequest.findMany({
          where: {
            isOverdue: true,
            isReturned: false,
            inProgress: true,
          },
          include: {
            request: {
              include: {
                user: true,
              },
            },
          },
        });

        for (const updatedRequest of updatedRequests) {
          if (updatedRequest.request.reviewedBy) {
            await prisma.notification.create({
              data: {
                id: generateId(15),
                userId: updatedRequest.request.reviewedBy,
                recepientId: updatedRequest.request.user.id,
                resourceId: `/request/${updatedRequest.requestId}`,
                title: `Overdue Request: ${updatedRequest.request.title}`,
                resourceType: "REQUEST",
                notificationType: "WARNING",
                message: `The borrow request titled "${updatedRequest.request.title}" is overdue. Please return the item as soon as possible.`,
              },
            });

            await prisma.notification.create({
              data: {
                id: generateId(15),
                userId: updatedRequest.request.reviewedBy,
                recepientId: updatedRequest.request.departmentId, 
                resourceId: `/request/${updatedRequest.requestId}`,
                title: `Overdue Request: ${updatedRequest.request.title}`,
                resourceType: "REQUEST",
                notificationType: "REMINDER",
                message: `The borrow request titled "${updatedRequest.request.title}" is overdue. Please take immediate action to ensure the item is returned promptly.`,
              },
            });
          }
        }
      }

      return {
        transportRequests: updatedTransportRequests,
        venueRequests: updatedVenueRequests,
        returnableRequests: updatedReturnableRequests,
        overdueReturnableRequests: overdueReturnableRequests,
      };
    });

    console.log(
      `Successfully updated ${result.transportRequests.count} transport requests, ${result.venueRequests.count} venue requests, ${result.returnableRequests.count} returnable requests, and ${result.overdueReturnableRequests.count} overdue returnable requests.`
    );

    // WebSocket notifications for updated requests
    const updatedRequests = await prisma.$transaction([
      prisma.transportRequest.findMany({
        where: {
          dateAndTimeNeeded: {
            lte: now,
          },
          inProgress: true,
          request: {
            status: "APPROVED",
          },
        },
        select: {
          requestId: true,
        },
      }),
      prisma.venueRequest.findMany({
        where: {
          startTime: {
            lte: now,
          },
          endTime: {
            gt: now,
          },
          inProgress: true,
          request: {
            status: "APPROVED",
          },
        },
        select: {
          requestId: true,
        },
      }),
      prisma.returnableRequest.findMany({
        where: {
          dateAndTimeNeeded: {
            lte: now,
          },
          returnDateAndTime: {
            gt: now,
          },
          inProgress: true,
          request: {
            status: "APPROVED",
          },
        },
        select: {
          requestId: true,
        },
      }),
      prisma.returnableRequest.findMany({
        where: {
          returnDateAndTime: {
            lt: now,
          },
          inProgress: true,
          isReturned: false,
          isOverdue: true,
          request: {
            status: "APPROVED",
          },
        },
        select: {
          requestId: true,
        },
      }),
    ]);

    const updatedRequestIds = [
      ...updatedRequests[0].map((request) => request.requestId),
      ...updatedRequests[1].map((request) => request.requestId),
      ...updatedRequests[2].map((request) => request.requestId),
      ...updatedRequests[3].map((request) => request.requestId),
    ];

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "INVALIDATE_QUERIES",
            queryKey: updatedRequestIds,
          })
        );
      }
    });
  } catch (error) {
    console.error("Error updating inProgress and overdue status:", error);
  }
}

// Schedule the job to run every 10 seconds
const job = new CronJob(
  "*/10 * * * * *",
  updateInProgressStatus,
  null,
  true,
  "Asia/Singapore"
);

console.log("Worker process started");
