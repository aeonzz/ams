import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";
import { checkAuth } from "@/lib/auth/utils";
import { currentUser } from "@/lib/actions/users";

export async function GET(req: Request) {
  try {
    await checkAuth();
    const [data] = await currentUser();

    const result = await db.request.findMany({
      where: {
        userId: data?.id,
      },
      include: {
        jobRequest: true,
        supplyRequest: true,
        returnableRequest: true,
        transportRequest: true,
        venueRequest: true,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(errorMonitor);
    return NextResponse.json(
      { error: "Form submission failed" },
      { status: 500 }
    );
  }
}
