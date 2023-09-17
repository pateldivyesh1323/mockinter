import { sendEmail } from "@/libmail/mailer";
import { Types } from "mongoose";
import { NextResponse,NextRequest } from "next/server";

type ReqType = {
    userId:Types.ObjectId,
    emailType:string,
    email:string
}

export async function POST(req:NextRequest):Promise<NextResponse>{
    const { userId, emailType, email }: ReqType = await req.json();
    
    if(!userId || !emailType || !email)
    {
        return NextResponse.json({success:false,message:"Cannot send mail, please provide all details"},{status:400})
    }
    try
    {
        let {success,message} = await sendEmail({email, emailType, userId});
        return NextResponse.json({success,message})
    }catch(error)
    {
        return NextResponse.json({success:false,message:"Internal Server Error"},{status:500})
    }
}