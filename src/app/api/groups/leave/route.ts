import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Check if user is a member of the group
    const membership = await prisma.groupMember.findFirst({
      where: {
        userId: session.user.id,
        groupId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 400 }
      );
    }

    // Get the group to check if user is the admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the user's membership
      await tx.groupMember.delete({
        where: {
          id: membership.id,
        },
      });

      // If user is the admin, either delete the group or transfer admin status
      if (group.adminId === session.user.id) {
        // Check if there are any other members
        const otherMembers = await tx.groupMember.findMany({
          where: {
            groupId,
          },
        });

        if (otherMembers.length === 0) {
          // No other members, delete the group
          await tx.group.delete({
            where: {
              id: groupId,
            },
          });
        } else {
          // Transfer admin status to another member
          const newAdmin = otherMembers[0];
          await tx.group.update({
            where: {
              id: groupId,
            },
            data: {
              adminId: newAdmin.userId,
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { error: "Failed to leave group" },
      { status: 500 }
    );
  }
}
