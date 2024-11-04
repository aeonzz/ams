import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";

export async function GET(req: Request) {
  try {
    const departments = await db.department.findMany({
      where: {
        isArchived: false,
        managesTransport: true,
      },
    });

    return NextResponse.json({ data: departments }, { status: 200 });
  } catch (error) {
    console.log(errorMonitor);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
