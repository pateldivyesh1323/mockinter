import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
    try {
        let userId = req.nextUrl.searchParams.get("searchid");
        let isOwner = false;
        if (userId === null) {
            userId = req.headers.get("userId");
            isOwner = true;
        }

        const userData = await User.findById(userId).select([
            "_id",
            "username",
            "name",
            "image",
            ...(isOwner ? ["email"] : []),
            "role",
            "dateOfBirth",
            "about",
            "location",
            "profession",
            "skills",
            "experience",
            "rating",
            "createdAt",
            "isVerified",
        ]);

        if (userData !== null) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Fetched Profile Successfully",
                    data: userData,
                },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
