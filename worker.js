import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import WebSocket, { WebSocketServer } from "ws";

const prisma = new PrismaClient();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

async function updateInProgressStatus() {
  const now = new Date();
  console.log(now);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Update TransportRequests
      const updatedTransportRequests = await prisma.transportRequest.updateMany({
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
      });

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

      return {
        transportRequests: updatedTransportRequests,
        venueRequests: updatedVenueRequests,
      };
    });

    console.log(`Successfully updated ${result.transportRequests.count} transport requests and ${result.venueRequests.count} venue requests`);

    // Fetch updated requests for WebSocket notifications
    const updatedRequests = await prisma.$transaction([
      prisma.transportRequest.findMany({
        where: {
          dateAndTimeNeeded: {
            lte: now,
          },
          inProgress: {
            equals: true,
          },
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
          inProgress: {
            equals: true,
          },
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
    console.error("Error updating inProgress status:", error);
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