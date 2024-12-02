import { PrismaClient } from "@prisma/client";
import { generateId } from "lucia";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    console.log("Cron job running...");
    const now = new Date();

    // Update requests that are now in progress
    const updatedReturnableRequests = await prisma.returnableRequest.updateMany(
      {
        where: {
          dateAndTimeNeeded: {
            lte: now,
          },
          returnDateAndTime: {
            gt: now,
          },
          inProgress: false,
          request: {
            status: "APPROVED",
          },
        },
        data: {
          inProgress: true,
        },
      }
    );

    // Find potential overdue requests
    const returnableRequests = await prisma.returnableRequest.findMany({
      where: {
        returnDateAndTime: {
          lt: now,
        },
        isReturned: false,
        inProgress: true,
        isOverdue: false,
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

    const overdueRequestIds = returnableRequests
      .filter((request) => now > request.returnDateAndTime)
      .map((request) => request.id);

    if (overdueRequestIds.length > 0) {
      await prisma.returnableRequest.updateMany({
        where: {
          id: { in: overdueRequestIds },
        },
        data: {
          isOverdue: true,
        },
      });

      const updatedRequests = await prisma.returnableRequest.findMany({
        where: {
          id: { in: overdueRequestIds },
        },
        include: {
          request: {
            include: {
              user: true,
            },
          },
        },
      });

      for (const updatedRequest of updatedRequests) {
        if (updatedRequest.request.reviewedBy) {
          await prisma.notification.create({
            data: {
              id: generateId(5),
              userId: updatedRequest.request.reviewedBy,
              recepientId: updatedRequest.request.user.id,
              resourceId: `/request/${updatedRequest.requestId}`,
              title: `Overdue Request: ${updatedRequest.request.title}`,
              resourceType: "REQUEST",
              notificationType: "WARNING",
              message: `The borrow request titled "${updatedRequest.request.title}" is overdue. Please return the item as soon as possible.`,
            },
          });

          await prisma.notification.create({
            data: {
              id: generateId(5),
              userId: updatedRequest.request.reviewedBy,
              recepientId: updatedRequest.request.departmentId,
              resourceId: `/request/${updatedRequest.requestId}`,
              title: `Overdue Request: ${updatedRequest.request.title}`,
              resourceType: "REQUEST",
              notificationType: "REMINDER",
              message: `The borrow request titled "${updatedRequest.request.title}" is overdue. Please take immediate action to ensure the item is returned promptly.`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron job completed successfully",
      updatedCount: updatedReturnableRequests.count,
      overdueCount: overdueRequestIds.length,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cron job failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
