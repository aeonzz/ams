import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    venueId: string;
  };
}

export async function GET(req: Request, params: Context) {
  await checkAuth();
  const { venueId } = params.params;
  try {
    const venueExist = await db.venue.findUnique({
      where: {
        id: params.params.venueId,
      },
    });

    if (!venueExist) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    const result = await db.genericAuditLog.findMany({
      where: {
        entityId: venueId,
      },
      include: {
        changedBy: true,
      },
      orderBy: {
        timestamp: "desc",
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
