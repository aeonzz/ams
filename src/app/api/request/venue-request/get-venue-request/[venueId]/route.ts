import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    venueId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { params } = context;

  try {
    const isVenueExist = await db.venue.findUnique({
      where: {
        id: params.venueId,
      },
    });

    if (!isVenueExist) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const result = await db.venueRequest.findMany({
      where: {
        venueId: params.venueId,
        request: {
          status: {
            in: ["APPROVED", "PENDING", "REVIEWED", "ON_HOLD"],
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        actualStart: true,
        startTime: true,
        endTime: true,
        request: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
        },
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
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
