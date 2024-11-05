import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";
import { currentUser } from "@/lib/actions/users";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const [requests, users] = await Promise.all([
      db.request.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          department: true,
        },
      }),
      db.user.findMany(),
    ]);

    return NextResponse.json({ data: { requests, users } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
