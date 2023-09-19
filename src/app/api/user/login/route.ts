import User from '@/srclib/database/models/UserModel';
import { connectDB } from '@/srclib/database/mongodb';
import generateToken from '@/srclib/helpers/generateToken';
import { NextRequest, NextResponse } from 'next/server'

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let data = await req.json();
    let { email, password } = data;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all credentials" },
        { status: 400 }
      )
    }

    let user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      let { _id, name, email, image } = user;
      const response = NextResponse.json(
        {
          success: true, message: "Login Successful",
          data: { id: _id, name, email, image }
        },
        {
          status: 201
        })

      response.cookies.set("token", generateToken(_id),
        { httpOnly: true }
      )

      return response;
    }

    return NextResponse.json({ success: false, message: "Credentials does not match!" }, { status: 400 })

  } catch (error) {

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })

  }
}