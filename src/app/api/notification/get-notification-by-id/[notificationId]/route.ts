import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";

interface Context {
  params: {
    notificationId: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { notificationId } = context.params;
  try {
    const result = await db.notification.findUnique({
      where: {
        id: notificationId,
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
