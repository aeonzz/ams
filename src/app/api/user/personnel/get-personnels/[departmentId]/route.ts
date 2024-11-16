import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    departmentId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { departmentId } = context.params;
  try {
    const result = await db.userDepartment.findMany({
      where: {
        departmentId: departmentId,
        user: {
          userRole: {
            some: {
              role: {
                name: "PERSONNEL",
              },
            },
          },
        },
      },
      include: {
        user: {
          include: {
            userRole: true,
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
