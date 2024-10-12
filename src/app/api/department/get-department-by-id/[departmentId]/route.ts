import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";

interface Context {
  params: {
    departmentId: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { departmentId } = context.params;
  try {
    const result = await db.department.findUnique({
      where: {
        id: departmentId,
      },
      include: {
        request: {
          include: {
            jobRequest: true,
          },
        },
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
