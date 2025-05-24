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
    const { applicationId, status, responseNote } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Status must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    // Get the application
    const application = await prisma.groupApplication.findUnique({
      where: { id: applicationId },
      include: {
        group: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user is the group admin
    if (application.group.adminId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the group admin can process applications" },
        { status: 403 }
      );
    }

    if (status === "APPROVED") {      // Check if group is full
      const memberCount = await prisma.user.count({
        where: { groupId: application.groupId },
      });

      if (memberCount >= 10) {
        return NextResponse.json(
          { error: "Group is full" },
          { status: 400 }
        );
      }

      // Process approval in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update application status
        const updatedApplication = await tx.groupApplication.update({
          where: { id: applicationId },
          data: {
            status,
            responseNote,
          },
        });        // Add user to group
        await tx.user.update({
          where: {
            id: application.userId
          },
          data: {
            groupId: application.groupId,
          },
        });

        return updatedApplication;
      });

      return NextResponse.json(result);
    } else {
      // Just update application status for rejection
      const result = await prisma.groupApplication.update({
        where: { id: applicationId },
        data: {
          status,
          responseNote,
        },
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}
