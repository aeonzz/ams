import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { checkAuth } from "@/lib/auth/utils";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, context: Context) {
  await checkAuth();
  const { userId } = context.params;
  try {
    const isUserExists = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userDepartments: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!isUserExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requests = await db.jobRequest.findMany({
      where: {
        assignedTo: userId,
      },
      include: {
        assignedUser: true,
      },
    });

    return NextResponse.json(
      { data: { requests: requests, user: isUserExists } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}
