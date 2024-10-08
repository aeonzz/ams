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
    const result = await db.notification.findMany({
      where: {
        userId: context.params.userId,
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
