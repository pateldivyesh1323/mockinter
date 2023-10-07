import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("id");
        const userData = await User.findById(userId).select(["_id", "name", "image", "email", "isVerified"]);
        return NextResponse.json({ success: true, message: "Fetched Profile Successfully", data: userData }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}