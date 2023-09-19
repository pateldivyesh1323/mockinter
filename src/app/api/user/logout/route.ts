import { NextResponse } from "next/server";

export async function GET() {
    try {

        let response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 201 });
        response.cookies.delete("token");
        return response;

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}