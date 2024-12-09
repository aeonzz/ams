import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { authMiddleware } from "@/app/lucia-middleware";

interface Context {
  params: {
    requestId: string;
  };
}

async function handler(req: NextRequest, user: any, context: Context) {
  const { requestId } = context.params;
  try {
    const result = await db.request.findFirst({
      where: {
        id: requestId,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
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
                    userRole: {
                      select: {
                        role: true,
                        user: true,
                      },
                    },
                  },
                },
                reviewer: true,
              },
            },
            jobRequestEvaluation: true,
            department: true,
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
            request: {
              include: {
                user: true,
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
                  include: {
                    files: true,
                    userRole: {
                      include: {
                        role: true,
                        user: true,
                      },
                    },
                  },
                },
                user: true,
              },
            },
            department: true,
          },
        },
        venueRequest: {
          include: {
            venue: {
              include: {
                venueSetupRequirement: true,
              },
            },
            department: {
              include: {
                userRole: {
                  include: {
                    role: true,
                    user: true,
                  },
                },
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
      { error: "Something went wrong! try again later" },
      { status: 500 }
    );
  }
}

export const GET = (request: NextRequest, context: Context) =>
  authMiddleware(request, handler, context);
