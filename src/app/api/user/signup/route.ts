import { NextResponse, NextRequest } from "next/server";
import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import generateToken from "@/srclib/helpers/generateToken";
import { ROLES } from "@/srcconstants";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const {
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

        if (await User.exists({ email })) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists please login!",
                },
                { status: 409 }
            );
        }

        let user = await User.create({
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
            return NextResponse.json(
                {
                    success: true,
                    message: "Created new account successfully!",
                    data: { token },
                },
                { status: 200 }
            );
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
