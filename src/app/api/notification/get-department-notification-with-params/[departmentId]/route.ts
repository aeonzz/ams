import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    departmentId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const result = await db.notification.findMany({
      where: {
        recepientId: context.params.departmentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      skip,
      take: limit,
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
