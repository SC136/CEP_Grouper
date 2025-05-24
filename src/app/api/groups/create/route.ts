import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

// Create a group
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    // Check if group name is already taken
    const existingGroup = await prisma.group.findUnique({
      where: { name },
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: "Group name is already taken" },
        { status: 409 }
      );
    }

    // Create group transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the group with the current user as admin
      const group = await tx.group.create({
        data: {
          name,
          adminId: session.user.id,
        },
      });

      // Add the admin as a member
      await tx.groupMember.create({
        data: {
          userId: session.user.id,
          groupId: group.id,
        },
      });

      return group;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
