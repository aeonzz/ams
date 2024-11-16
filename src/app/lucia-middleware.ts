import { validateRequest } from "@/lib/auth/lucia";
import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(
  request: NextRequest,
  handler: (
    request: NextRequest,
    user: any,
    context?: any
  ) => Promise<NextResponse>,
  context?: any
) {
  const { user, session } = await validateRequest();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(request, user, context);
}
