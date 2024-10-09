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
    const isNotificationExist = await db.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!isNotificationExist) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: isNotificationExist }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
