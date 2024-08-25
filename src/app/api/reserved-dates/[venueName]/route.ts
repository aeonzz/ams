import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

interface Context {
  params: {
    venueName: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { venueName } = params.params;
  const today = new Date();
  try {
    const reservedDatesAndTimes = await db.venueRequest.findMany({
      select: {
        venueName: true,
        startTime: true,
        endTime: true,
        request: {
          select: {
            status: true,
            title: true,
            department: true,
          },
        },
      },
      where: {
        venueName: venueName,
        startTime: {
          gt: today,
        },
        request: {
          status: "PENDING",
        },
      },
      orderBy: {
        id: "desc"
      }
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
