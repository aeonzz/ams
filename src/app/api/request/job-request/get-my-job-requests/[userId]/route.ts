import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(request: NextRequest, context: Context) {
  await checkAuth();

  const { params } = context;

  try {
    const isUserExists = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!isUserExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await db.jobRequest.findMany({
      where: {
        assignedTo: params.userId,
        request: {
          status: "APPROVED",
        },
      },
      include: {
        request: {
          include: {
            department: true,
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
