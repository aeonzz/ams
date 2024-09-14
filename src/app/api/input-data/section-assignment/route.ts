import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const [users, sections] = await Promise.all([
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
      db.section.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({ data: { users, sections } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
