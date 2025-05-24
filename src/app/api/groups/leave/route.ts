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
    }    // Check if user is a member of the group
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        groupId: true,
      },
    });

    if (user?.groupId !== groupId) {
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
    }    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Remove user from group
      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          groupId: null,
        },
      });

      // If user is the admin, either delete the group or transfer admin status
      if (group.adminId === session.user.id) {
        // Check if there are any other members
        const otherMembers = await tx.user.findMany({
          where: {
            groupId: groupId,
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
              adminId: newAdmin.id,
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
