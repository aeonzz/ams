import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";

export async function GET(req: Request) {
  try {
    const roles = await db.role.findMany({});

    return NextResponse.json({ data: roles }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
