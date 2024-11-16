import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    venueId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { venueId } = context.params;
  const today = new Date();
  try {
    const reservedDatesAndTimes = await db.venueRequest.findMany({
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
      select: {
        startTime: true,
        endTime: true,
        request: {
          select: {
            status: true,
            title: true,
            department: true,
            user: true,
            venueRequest: {
              select: {
                venue: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({ data: reservedDatesAndTimes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest, context: Context) =>
  authMiddleware(request, handler, context);
