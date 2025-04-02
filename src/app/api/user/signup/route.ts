import { NextResponse, NextRequest } from "next/server";
import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import generateToken from "@/srclib/helpers/generateToken";
import { AUTH_TOKEN_KEY, ROLES } from "@/srcconstants";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const {
            username,
            name,
            password,
            email,
            role,
            dateOfBirth,
            about,
            location,
            profession,
            skills,
            experience,
        } = await req.json();

        if (
            !username ||
            !name ||
            !password ||
            !email ||
            !role ||
            !dateOfBirth ||
            !about ||
            !location ||
            !profession ||
            !skills
        ) {
            return NextResponse.json(
                { success: false, message: "Please provide all Details" },
                { status: 401 }
            );
        }

        if (!ROLES.includes(role)) {
            return NextResponse.json(
                { success: false, message: "Invalid Role" },
                { status: 401 }
            );
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        existingUser.username === username
                            ? "Username already exists"
                            : "Email already exists",
                },
                { status: 409 }
            );
        }

        let user = await User.create({
            username,
            name,
            password,
            email,
            role,
            dateOfBirth,
            about,
            location,
            profession,
            skills,
            experience,
        });

        if (user) {
            const token = await generateToken(user._id);

            const response = NextResponse.json(
                {
                    success: true,
                    message: "Created new account successfully!",
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
                { success: false, message: "Something went wrong!" },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
