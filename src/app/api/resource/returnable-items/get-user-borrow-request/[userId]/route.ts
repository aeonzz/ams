import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    userId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { userId } = context.params;
  try {
    const result = await db.returnableRequest.findMany({
      where: {
        request: {
          userId: userId,
        },
      },
      include: {
        request: true,
      },
    });

    const formattedData = result.map((request) => ({
      title: request.request.title,
      id: request.requestId,
      isOverdue: request.isOverdue,
      isLost: request.isOverdue,
      inProgress: request.inProgress,
      completed: request.request.completedAt,
			status: request.request.status,
    }));

    return NextResponse.json({ data: formattedData }, { status: 200 });
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
