import { NextResponse, NextRequest } from "next/server";
import User from "@/libdatabase/models/UserModel";
import { connectDB } from "@/libdatabase/mongodb";
import generateToken from "@/libhelpers/generateToken";

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
      return NextResponse.json(
        {
          success: true,
          message: "Created new account successfully!",
          data: { id: _id, name, email, image, token: generateToken(_id)},
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
      { success: false, message: error._message },
      { status: 500 }
    );
  }
}
