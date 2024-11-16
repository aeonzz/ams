import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";
import { validateRequest } from "@/lib/auth/lucia";

async function handler(req: Request) {
  const { user, session } = await validateRequest();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.request.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        jobRequest: true,
        supplyRequest: true,
        returnableRequest: true,
        transportRequest: true,
        venueRequest: true,
      },
      orderBy: {
        createdAt: "asc",
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

export const GET = (request: NextRequest) => authMiddleware(request, handler);
