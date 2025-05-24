import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

// Apply to join a group
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { groupId, notes } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Check if the group is full (has 10 members)
    if (group._count.members >= 10) {
      return NextResponse.json(
        { error: "Group is full" },
        { status: 400 }
      );
    }    
      // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        groupId: true,
      },
    });

    if (existingUser?.groupId === groupId) {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 400 }
      );
    }try {
      // Try to handle all application scenarios in a transaction
      return await prisma.$transaction(async (tx) => {
        // Check if user already has a pending application
        const pendingApplication = await tx.groupApplication.findFirst({
          where: {
            applicantId: session.user.id,
            groupId,
            status: "PENDING", 
          },
        });

        if (pendingApplication) {
          return NextResponse.json(
            { error: "You already have a pending application for this group" },
            { status: 400 }
          );
        }
        
        // Check for any existing application (rejected or approved)
        const existingApplication = await tx.groupApplication.findFirst({
          where: {
            applicantId: session.user.id,
            groupId,
          },
        });
        
        if (existingApplication) {
          // Update existing application to pending
          const updatedApplication = await tx.groupApplication.update({
            where: { id: existingApplication.id },
            data: {
              status: "PENDING",
              notes: notes || undefined,
              responseNote: null, // Clear any previous rejection/approval message
              updatedAt: new Date(), // Update the timestamp
            },
          });
          
          return NextResponse.json(updatedApplication, { status: 200 });
        }

        // If no existing application, create a new one
        const application = await tx.groupApplication.create({
          data: {
            applicantId: session.user.id,
            groupId,
            notes: notes || undefined,
          },
        });

        return NextResponse.json(application, { status: 201 });
      });
    } catch (transactionError) {
      // Special handling for the unique constraint violation, which might happen if a user
      // was previously in the group, then left, and is now trying to apply again
      console.error("Transaction error:", transactionError);
      
      // Delete any existing application and create a new one
      try {
        // First, try to delete any existing application
        await prisma.groupApplication.deleteMany({
          where: {
            applicantId: session.user.id,
            groupId,
          },
        });
        
        // Then create a new application
        const newApplication = await prisma.groupApplication.create({
          data: {
            applicantId: session.user.id,
            groupId,
            notes: notes || undefined,
          },
        });
        
        return NextResponse.json(newApplication, { status: 201 });
      } catch (finalError) {
        console.error("Final error in application process:", finalError);
        return NextResponse.json(
          { error: "Could not process your application. Please try again later." },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error applying to group:", error);
    return NextResponse.json(
      { error: "Failed to apply to group" },
      { status: 500 }
    );
  }
}
