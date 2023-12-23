import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        let { title, description, price } = await req.json();
        const interviewer = req.headers.get("id");
        if (!title || !description) {
            return NextResponse.json({ success: false, message: "Please provide all credentials!" }, { status: 400 });
        }
        let newInterview = await Interview.create({ title, description, interviewer, price: price || 0 });
        return NextResponse.json({ success: true, message: "Created new interview successfully!", data: newInterview }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error!" }, { status: 500 });
    }
}