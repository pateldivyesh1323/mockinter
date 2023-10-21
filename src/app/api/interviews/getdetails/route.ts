import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (id === null) {
            return NextResponse.json({ success: false, message: "Please provide id of Interview" }, { status: 400 });
        }

        const interview = await Interview.findById(id);
        if (interview !== null) {
            return NextResponse.json({ success: true, message: "Fetched interview successfully", data: interview }, { status: 200 });
        }
        else {
            return NextResponse.json({ success: false, message: "Interview not found!" }, { status: 400 });
        }
    }
    catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}