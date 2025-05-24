import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's application history with group and admin details
    const applications = await prisma.groupApplication.findMany({
      where: {
        applicantId: session.user.id,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            admin: {
              select: {
                name: true,
                rollNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', // Most recent applications first
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching application history:", error);
    return NextResponse.json(
      { error: "Failed to fetch application history" },
      { status: 500 }
    );
  }
}
