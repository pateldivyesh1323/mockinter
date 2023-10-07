import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        let body = await req.json();
        const { token, password } = body;
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        })
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
        }
        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Password Changed,Taking you to login!",
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}