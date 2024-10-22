import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

export async function GET(req: Request) {
  await checkAuth();
  try {
    const result = await db.supplyItemCategory.findMany({
      where: {
        isArchived: false,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
