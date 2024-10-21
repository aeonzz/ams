import { NextRequest, NextResponse } from "next/server";
import { withRoles } from "@/middleware/withRole";
import { db } from "@/lib/db/index";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    departmentId: string;
  };
}

export async function GET(request: NextRequest, params: Context) {
  await checkAuth();
  try {
    const departmentExist = await db.department.findUnique({
      where: {
        id: params.params.departmentId,
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
        departmentId: params.params.departmentId,
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
