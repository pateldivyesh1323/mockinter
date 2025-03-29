import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import generateToken from "@/srclib/helpers/generateToken";
import { AUTH_TOKEN_KEY } from "@/src/constants";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        let data = await req.json();
        let { email, password } = data;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Please provide all credentials" },
                { status: 400 }
            );
        }

        let user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            let { _id } = user;
            const token = await generateToken(_id);
            const response = NextResponse.json(
                {
                    success: true,
                    message: "Login Successful",
                },
                { status: 200 }
            );

            response.cookies.set(AUTH_TOKEN_KEY, token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            return response;
        } else {
            return NextResponse.json(
                { success: false, message: "Credentials does not match!" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
