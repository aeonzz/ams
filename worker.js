import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { formatInTimeZone, toDate } from "date-fns-tz";
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
      const updatedRequests = await prisma.transportRequest.updateMany({
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

      if (updatedRequests.count > 0) {
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

      return updatedRequests;
    });

    console.log(`Successfully updated ${result.count} transport requests`);

    const updatedRequests = await prisma.transportRequest.findMany({
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
    });

    const updatedRequestIds = updatedRequests.map(
      (request) => request.requestId
    );
    console.log(updatedRequestIds);

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
