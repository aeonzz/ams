"use server";

import { db } from "@/lib/db/index";
import { CronJob } from "cron";

export async function setupTransportRequestUpdater() {
  const job = new CronJob(
    "0 * * * *",
    async () => {
      console.log("Running updateInProgressStatus job");
      await updateInProgressStatus();
    },
    null,
    true,
    "UTC"
  );
  console.log("Cron job scheduled");
  return "Cron job scheduled successfully";
}

async function updateInProgressStatus() {
  const now = new Date();

  try {
    const result = await db.transportRequest.updateMany({
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

    console.log(`Successfully updated ${result.count} transport requests`);
  } catch (error) {
    console.error("Error updating inProgress status:", error);
  }
}
