import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  await checkAuth();
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
          department: {
            select: {
              id: true,
              name: true,
            },
          },
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
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
