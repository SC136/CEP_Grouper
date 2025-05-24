import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { validateRollNumber } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rollNumber, name, password } = body;

    // Basic validation
    if (!rollNumber || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if roll number is valid
    const isValidRollNumber = await validateRollNumber(rollNumber);
    if (!isValidRollNumber) {
      return NextResponse.json(
        { error: "Invalid roll number" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { rollNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this roll number already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        rollNumber,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        rollNumber: newUser.rollNumber,
        name: newUser.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
