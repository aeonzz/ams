import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

interface Context {
  params: {
    itemId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { itemId } = params.params;
  const today = new Date();
  try {
    const reservedDatesAndTimes = await db.returnableRequest.findMany({
      select: {
        item: true,
        dateAndTimeNeeded: true,
        returnDateAndTime: true,
        request: {
          select: {
            status: true,
            title: true,
            department: true,
          },
        },
      },
      where: {
        itemId: itemId,
        returnDateAndTime: {
          gt: today,
        },
        request: {
          OR: [{ status: "PENDING" }, { status: "APPROVED" }],
        },
      },
      orderBy: {
        dateAndTimeNeeded: "asc",
      },
    });

    return NextResponse.json({ data: reservedDatesAndTimes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reserved dates" },
      { status: 500 }
    );
  }
}
