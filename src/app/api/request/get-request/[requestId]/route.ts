import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { errorMonitor } from "stream";
import { currentUser } from "@/lib/actions/users";
import { checkAuth } from "@/lib/auth/utils";
import placeholder from "public/placeholder.svg";

interface Context {
  params: {
    requestId: string;
  };
}

export async function GET(req: Request, params: Context) {
  await checkAuth();
  const { requestId } = params.params;
  try {
    const result = await db.request.findFirst({
      where: {
        id: requestId,
      },
      include: {
        reviewer: {
          include: {
            userDepartments: {
              include: {
                department: true,
              },
            },
          },
        },
        user: {
          include: {
            userDepartments: {
              include: {
                department: true,
              },
            },
          },
        },
        supplyRequest: {
          include: {
            items: {
              include: {
                supplyItem: true,
              },
            },
            request: true,
          },
        },
        jobRequest: {
          include: {
            assignedUser: true,
            request: {
              select: {
                user: true,
                department: {
                  select: {
                    files: true,
                  },
                },
              },
            },
            jobRequestEvaluation: true,
            reworkAttempts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
        returnableRequest: {
          include: {
            item: {
              include: {
                inventory: {
                  include: {
                    inventorySubItems: true,
                  },
                },
              },
            },
          },
        },
        transportRequest: {
          include: {
            vehicle: true,
            request: {
              select: {
                department: {
                  select: {
                    files: true,
                  },
                },
                user: true,
              },
            },
          },
        },
        venueRequest: {
          include: {
            venue: {
              include: {
                venueSetupRequirement: true,
              },
            },
            request: {
              select: {
                department: {
                  select: {
                    files: true,
                    userRole: {
                      select: {
                        role: true,
                        user: true,
                      },
                    },
                  },
                },
                user: true,
              },
            },
          },
        },
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
