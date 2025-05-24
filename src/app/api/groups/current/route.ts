import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    // Find user's group
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        groupId: true,
      },
    });

    if (!user?.groupId) {
      return NextResponse.json(null);
    }

    // Get the group details
    const userGroup = await prisma.group.findUnique({
      where: {
        id: user.groupId,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
          }
        },
        applications: {
          where: {
            status: "PENDING",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                rollNumber: true,
              },
            },
          },
        },
      },
    });

    if (!userGroup) {
      return NextResponse.json(null);
    }
    
    // Check if the current user is the admin
    const isAdmin = userGroup.adminId === session.user.id;
      // Format the response
    const result = {
      id: userGroup.id,
      name: userGroup.name,
      admin: userGroup.admin,
      members: userGroup.members,
      isUserAdmin: isAdmin,
      pendingApplications: isAdmin ? userGroup.applications.map(app => ({
        ...app,
        applicant: app.user
      })) : [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching user group:", error);
    return NextResponse.json(
      { error: "Failed to fetch user group" },
      { status: 500 }
    );
  }
}
