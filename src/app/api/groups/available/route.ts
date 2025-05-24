import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    // Get user's current group
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        groupId: true,
      },
    });

    const userGroupIds = user?.groupId ? [user.groupId] : [];    // Get user's pending applications
    const pendingApplications = await prisma.groupApplication.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      select: {
        groupId: true,
      },
    });

    const pendingApplicationGroupIds = pendingApplications.map((a) => a.groupId);

    // Get groups with fewer than 10 members, excluding groups the user is already in
    // or has pending applications to
    const groups = await prisma.group.findMany({
      where: {
        id: {
          notIn: [...userGroupIds, ...pendingApplicationGroupIds],
        },
      },
      include: {
        admin: {
          select: {
            name: true,
            rollNumber: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Filter groups with fewer than 10 members
    const availableGroups = groups.filter(group => group._count.members < 10);

    return NextResponse.json(availableGroups);
  } catch (error) {
    console.error("Error fetching available groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch available groups" },
      { status: 500 }
    );
  }
}
