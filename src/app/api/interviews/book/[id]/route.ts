import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, route: { params: { id: string } }) {
    try {
        const interviewID = route.params.id;
        const id = req.headers.get("id");
        const interviewData = await Interview.findById(interviewID)
        if (interviewData.interviewer === id) {
            return NextResponse.json({ success: false, message: "Interviewer cannot book its own interview!" }, { status: 401 })
        }
        if (interviewData.status === "booked") {
            return NextResponse.json({ success: false, message: "Interview already booked!" }, { status: 401 })
        }
        const updatedInterview = await Interview.findByIdAndUpdate(interviewID, { status: "booked", interviewee: id });
        console.log(updatedInterview)
        return NextResponse.json({ success: true, message: "Successfully booked interview!", data: updatedInterview }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}