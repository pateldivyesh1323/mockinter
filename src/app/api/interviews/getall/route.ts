import Interview from "@/srclib/database/models/InterviewModel";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        let interviews = await Interview.find();
        return NextResponse.json({ success: true, message: "Fetched data successfully", interviews }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}