import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    departmentId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { params } = context;

  try {
    const isDepartmentExists = await db.department.findUnique({
      where: {
        id: params.departmentId,
      },
    });

    if (!isDepartmentExists) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const result = await db.jobRequest.findMany({
      where: {
        request: {
          OR: [
            {
              status: "APPROVED",
            },
            {
              status: "COMPLETED",
            },
          ],
          departmentId: params.departmentId,
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
