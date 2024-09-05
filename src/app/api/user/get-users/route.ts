import { NextRequest, NextResponse } from "next/server";
import { withRoles } from "@/middleware/withRole";
import { db } from "@/lib/db/index";

export async function GET(request: NextRequest) {
  try {
    const result = await db.user.findMany();

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

