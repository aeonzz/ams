import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

async function handler(req: Request) {
  try {
    const [roles, users, departments] = await Promise.all([
      db.role.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      db.user.findMany({
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      }),
      db.department.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json(
      { data: { roles, users, departments } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest) => authMiddleware(request, handler);
