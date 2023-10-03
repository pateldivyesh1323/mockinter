import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import { sendEmail } from "@/srclib/mail/mailer";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { email } = await req.json();
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "No account with this email found!" }, { status: 400 });
        }
        let userId = user._id;
        let { success, message } = await sendEmail({ email, emailType: "RESET", userId });
        return NextResponse.json({ success, message })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}