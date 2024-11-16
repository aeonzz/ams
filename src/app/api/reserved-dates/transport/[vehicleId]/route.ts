import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    vehicleId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { vehicleId } = context.params;
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
