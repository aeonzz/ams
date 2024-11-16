import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    userId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  try {
    const [roles, userDepartments] = await Promise.all([
      db.role.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      db.userDepartment.findMany({
        where: {
          userId: context.params.userId,
        },
        select: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const departments = userDepartments.map(
      (userDepartment) => userDepartment.department
    );

    return NextResponse.json({ data: { roles, departments } }, { status: 200 });
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
