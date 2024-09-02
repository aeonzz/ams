import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

interface Context {
  params: {
    requestId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { requestId } = params.params;
  try {
    const result = await db.request.findMany({
      where: {
        id: requestId,
      },
      include: {
        consumableRequest: true,
        jobRequest: true,
        returnableRequest: true,
        transportRequest: true,
        venueRequest: true,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reserved dates" },
      { status: 500 }
    );
  }
}
