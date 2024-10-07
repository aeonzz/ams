import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, context: Context) {
  await checkAuth();
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
