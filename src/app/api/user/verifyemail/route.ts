import { connectDB } from "@/libdatabase/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/libdatabase/models/UserModel";

connectDB();

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const { token } = body;
        const user = await User.findOne({verifyToken: token, 
            verifyTokenExpiry: {$gt: Date.now()}
        })
        console.log(user);
        if(!user){
            return NextResponse.json({error:"Invalid Token"},{status:401});
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({message:"Email verified Successfully", success:true})
    }
    catch(error:any){
        return NextResponse.json({error:error.message},{status:500});
    }
}