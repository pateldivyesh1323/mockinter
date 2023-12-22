import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, route: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = route.params.id;
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