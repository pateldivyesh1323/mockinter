import User from "@/srclib/database/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username } = await req.json();

    const existingUser = await User.findOne({
        $or: [{ username }],
    });

    return NextResponse.json({
        success: true,
        message: existingUser
            ? "Username already exists"
            : "Username is available",
        data: { exists: existingUser ? true : false },
    });
}
