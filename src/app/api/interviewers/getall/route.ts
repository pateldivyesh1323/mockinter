import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/database/mongodb";
import User from "@/src/lib/database/models/UserModel";

connectDB();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";
        const search = searchParams.get("search") || "";

        const query: any = {
            role: { $in: ["INTERVIEWER", "BOTH"] },
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const interviewers = await User.find(query)
            .select("-password -email -createdAt -updatedAt")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalInterviewers = await User.countDocuments(query);

        const totalPages = Math.ceil(totalInterviewers / parseInt(limit));

        return NextResponse.json({
            success: true,
            data: {
                currentPage: parseInt(page),
                totalInterviewers,
                totalPages,
                interviewers,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
