import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    itemId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { itemId } = context.params;
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
            user: true,
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
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest, context: Context) =>
  authMiddleware(request, handler, context);
