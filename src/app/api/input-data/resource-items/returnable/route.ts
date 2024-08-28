import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const returnableItems = await db.returnableItem.findMany({});

    return NextResponse.json({ data: returnableItems }, { status: 200 });
  } catch (error) {
    console.log(errorMonitor);
    return NextResponse.json(
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
