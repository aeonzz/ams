import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    notificationId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
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

export const GET = (request: NextRequest, context: Context) =>
  authMiddleware(request, handler, context);
