import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

interface Context {
  params: {
    vehicleId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { vehicleId } = params.params;
  const today = new Date();
  try {
    const reservedDatesAndTimes = await db.transportRequest.findMany({
      where: {
        vehicleId: vehicleId,
        dateAndTimeNeeded: {
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
      select: {
        dateAndTimeNeeded: true,
        request: {
          select: {
            status: true,
            title: true,
            department: true,
            user: true,
            transportRequest: {
              select: {
                vehicle: true,
              }
            }
          },
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
