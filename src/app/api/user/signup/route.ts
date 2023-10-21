import { NextResponse, NextRequest } from "next/server";
import User from "@/srclib/database/models/UserModel";
import { connectDB } from "@/srclib/database/mongodb";
import generateToken from "@/srclib/helpers/generateToken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name, password, email } = await req.json();
    if (!name || !password || !email) {
      return NextResponse.json(
        { success: false, message: "Please provide all Credentials" },
        { status: 401 }
      );
    }
    if (await User.exists({ email })) {
      return NextResponse.json(
        { success: false, message: "User already exists please login!" },
        { status: 409 }
      );
    }
    let user = await User.create({ name, password, email });
    if (user) {
      let { _id, name, email, image } = user;
      const response = NextResponse.json(
        {
          success: true,
          message: "Created new account successfully!",
          data: { id: _id, name, email, image },
        },
        { status: 200 }
      );

      response.cookies.set("token", await generateToken(_id),
        { httpOnly: true }
      )

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
