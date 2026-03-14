import User from "@/lib/models/user";
import { connectDB } from "@/lib/db/dbase";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

connectDB();

export async function GET() {
  try {
    const email = "baidyane1@gmail.com";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If exists but not admin, update role
      if (existingUser.role !== "admin") {
        await User.findByIdAndUpdate(existingUser._id, {
          $set: { role: "admin" },
        });
        return NextResponse.json({
          message: "User existed, role updated to admin",
        });
      }
      return NextResponse.json({ message: "Admin already exists" });
    }

    // Copy profile from existing admin
    const existingAdmin = await User.findOne({
      email: "mamadousy1254@gmail.com",
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash("12345678;", 10);

    await User.create({
      gender: existingAdmin?.gender || "homme",
      email,
      password: hashedPassword,
      firstname: existingAdmin?.firstname || "Admin",
      lastname: existingAdmin?.lastname || "Baidyane",
      phone: existingAdmin?.phone || "0000000000",
      address: existingAdmin?.address || "",
      city: existingAdmin?.city || "",
      state: existingAdmin?.state || "",
      zip: existingAdmin?.zip || "",
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin baidyane1@gmail.com created successfully",
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
