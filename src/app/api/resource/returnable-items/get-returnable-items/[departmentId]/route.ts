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
    const departmentExist = await db.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!departmentExist) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }
    const result = await db.inventoryItem.findMany({
      where: {
        isArchived: false,
        departmentId: departmentExist.id,
        department: {
          isArchived: false,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        inventorySubItems: {
          include: {
            returnableRequest: true,
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
