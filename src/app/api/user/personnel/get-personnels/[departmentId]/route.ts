import { NextRequest, NextResponse } from "next/server";
import { withRoles } from "@/middleware/withRole";
import { db } from "@/lib/db/index";

interface Context {
  params: {
    departmentId: string;
  };
}

export async function GET(request: NextRequest, params: Context) {
  try {
    const result = await db.userDepartment.findMany({
      where: {
        departmentId: params.params.departmentId,
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
