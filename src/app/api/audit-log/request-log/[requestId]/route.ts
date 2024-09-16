import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    requestId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { requestId } = params.params;
  try {
    await checkAuth();
    const result = await db.genericAuditLog.findMany({
      where: {
        entityId: requestId,
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
