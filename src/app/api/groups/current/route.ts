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

    // Find user's group memberships
    const memberships = await prisma.groupMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        group: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                rollNumber: true,
              },
            },
            members: {
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
            applications: {
              where: {
                status: "PENDING",
              },
              include: {
                applicant: {
                  select: {
                    id: true,
                    name: true,
                    rollNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });    if (memberships.length === 0) {
      return NextResponse.json(null);
    }

    // Just return the first group (users should only be in one group)
    const userGroup = memberships[0].group;
    
    // Check if the current user is the admin
    const isAdmin = userGroup.adminId === session.user.id;
    
    // Format the response
    const result = {
      id: userGroup.id,
      name: userGroup.name,
      admin: userGroup.admin,
      members: userGroup.members.map(member => member.user),
      isUserAdmin: isAdmin,
      pendingApplications: isAdmin ? userGroup.applications : [],
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
