import {NextResponse, NextRequest} from 'next/server'
import User from '@/libdatabase/models/UserModel';
import { connectDB } from '@/libdatabase/mongodb';
import { sendEmail } from '@/libmail/mailer';
import generateToken from '@/libhelpers/generateToken';

connectDB();

export async function POST(req:NextRequest){
    try{
        const {name, password, email} = await req.json();
        if(!name || !password || !email)
        {
            return NextResponse.json({error:"Please provide all Credentials"},{status:401})
        }
        if(await User.exists({email}))
        {
            return NextResponse.json({message:"User already exists please login!"},{status:409});
        }
        
        let user = await User.create({name,password,email});
        await sendEmail({email:user.email,emailType:"VERIFY",userId:user._id});
        if(user)
        {
            const token = generateToken(user._id as string);
            return NextResponse.json({message:"Created new account successfully!",token},{status:200});
        }
        else
        {
            return NextResponse.json({message:"Something went wrong!"},{status:500})
        }

    }
    catch(error:any){
        return NextResponse.json({error:error.message},{status:500});
    }
}