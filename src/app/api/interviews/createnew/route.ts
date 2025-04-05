import Interview from "@/srclib/database/models/InterviewModel";
import { connectDB } from "@/srclib/database/mongodb";
import { getErrorMessage } from "@/srclib/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");
        let {
            title,
            description,
            price,
            currency,
            jobType,
            experienceLevel,
            duration,
            timezone,
            skillsToFocus,
            applicationDeadline,
            preferredDate,
        } = await req.json();

        if (
            !title ||
            !description ||
            !price ||
            !currency ||
            !jobType ||
            !experienceLevel ||
            !duration ||
            !timezone ||
            !skillsToFocus ||
            !applicationDeadline ||
            !preferredDate
        ) {
            return NextResponse.json(
                { success: false, message: "All fields are required!" },
                { status: 400 }
            );
        }

        if (price <= 0) {
            return NextResponse.json(
                { success: false, message: "Price must be greater than 0!" },
                { status: 400 }
            );
        }

        if (skillsToFocus.length === 0) {
            return NextResponse.json(
                { success: false, message: "Skills to focus are required!" },
                { status: 400 }
            );
        }

        if (preferredDate.length === 0) {
            return NextResponse.json(
                { success: false, message: "Preferred date is required!" },
                { status: 400 }
            );
        }

        if (applicationDeadline < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Application deadline must be in the future!",
                },
                { status: 400 }
            );
        }

        const interview = await Interview.create({
            title,
            description,
            price,
            currency,
            jobType,
            experienceLevel,
            duration,
            timezone,
            skillsToFocus,
            applicationDeadline,
            preferredDate,
            interviewee: userId,
        });

        return NextResponse.json({
            success: true,
            message: "Interview created successfully!",
            interview,
        });
    } catch (error) {
        console.log(getErrorMessage(error));
        return NextResponse.json(
            { success: false, message: "Internal server error!" },
            { status: 500 }
        );
    }
}
