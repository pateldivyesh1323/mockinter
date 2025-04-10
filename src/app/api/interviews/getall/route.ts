import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextResponse } from "next/server";

connectDB();

const statuses = ["booked", "completed", "cancelled"];

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const skip = (page - 1) * limit;

        if (limit > 25) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Limit cannot be greater than 25",
                },
                { status: 400 }
            );
        }

        let interviews = await Interview.find({
            status: { $nin: statuses },
        })
            .select(
                "title description status price currency jobType experienceLevel duration createdAt updatedAt interviewee preferredDate skillsToFocus"
            )
            .populate("interviewee")
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        const total = await Interview.countDocuments({
            status: { $nin: statuses },
        });

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json(
            {
                success: true,
                message: "Interviews fetched successfully",
                data: interviews,
                total,
                page,
                limit,
                totalPages,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching interviews:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch interviews",
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
