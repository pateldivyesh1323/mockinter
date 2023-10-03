import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/srclib/database/models/UserModel";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Email verified Successfully",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
