import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const interviewID = req.nextUrl.pathname.split("/").pop();

        let intervieweeID: string = req.headers.get("id") as string;
        console.log("ID : ", intervieweeID);
        let id = new mongoose.Types.ObjectId(intervieweeID);
        const interviewData = await Interview.findById(interviewID);

        // if (interviewData.interviewer === id) {
        //     return NextResponse.json({ success: false, message: "Interviewer cannot book its own interview!" }, { status: 401 })
        // }

        // if (interviewData.status === "booked") {
        //     return NextResponse.json({ success: false, message: "Interview already booked!" }, { status: 401 })
        // }

        // const updatedInterview = await Interview.findByIdAndUpdate(interviewID, { status: "booked", interviewee: id });

        // console.log(updatedInterview)
        // , data: updatedInterview
        return NextResponse.json(
            { success: true, message: "Successfully booked interview!" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
