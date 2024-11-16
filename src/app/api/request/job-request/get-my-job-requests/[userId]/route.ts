import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    userId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { params } = context;

  try {
    const isUserExists = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!isUserExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await db.jobRequest.findMany({
      where: {
        assignedTo: params.userId,
        request: {
          status: "APPROVED",
        },
      },
      include: {
        request: {
          include: {
            department: true,
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
