import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

interface Context {
  params: {
    venueId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { venueId } = params.params;
  const today = new Date();
  try {
    const reservedDatesAndTimes = await db.venueRequest.findMany({
      select: {
        startTime: true,
        endTime: true,
        request: {
          select: {
            status: true,
            title: true,
            department: true,
            user: true,
          },
        },
      },
      where: {
        venueId: venueId,
        startTime: {
          gt: today,
        },
        request: {
          OR: [
            {
              status: "PENDING",
            },
            {
              status: "APPROVED",
            },
            {
              status: "REVIEWED",
            },
          ],
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({ data: reservedDatesAndTimes }, { status: 200 });
  } catch (error) {
    console.log(errorMonitor);
    return NextResponse.json(
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
