import { sendEmail } from "@/srclib/mail/mailer";
import { Types } from "mongoose";
import { NextResponse, NextRequest } from "next/server";

type ReqType = {
    userId: Types.ObjectId,
    emailType: string,
    email: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { userId, email }: ReqType = await req.json();

    if (!userId || !email) {
        return NextResponse.json({ success: false, message: "Cannot send mail, please provide all credentials" }, { status: 400 })
    }
    try {
        let { success, message } = await sendEmail({ email, emailType: "VERIFY", userId });
        return NextResponse.json({ success, message })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}