import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const id = req.nextUrl.pathname.split("/").pop();
        const interview = await Interview.findById(id)
            .select(
                "title description status price currency jobType experienceLevel duration createdAt updatedAt interviewee preferredDate"
            )
            .populate("interviewee");

        if (interview !== null) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Fetched interview successfully",
                    data: interview,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Interview not found!" },
                { status: 400 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
