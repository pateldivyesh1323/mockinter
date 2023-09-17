import User from '@/libdatabase/models/UserModel';
import { connectDB } from '@/libdatabase/mongodb';
import generateToken from '@/libhelpers/generateToken';
import { NextRequest, NextResponse } from 'next/server'

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let data = await req.json();
    let { email, password } = data;
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Please provide all credentials" }, { status: 400 })
    }
    let user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      let { _id, name, email, image } = user;
      return NextResponse.json({ success: true, message: "Login Successful", data: { id: _id, name, email, image, token: generateToken(_id) }, }, { status: 201 })
    }
    return NextResponse.json({ success: false, message: "Credentials does not match!" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}