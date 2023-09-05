import nodemailer from 'nodemailer';
import User from '@/libdatabase/models/UserModel';
import bcryptjs from 'bcryptjs';
import { connectDB } from '@/libdatabase/mongodb';

connectDB();

const enum EMAIL_TYPE {
    VERIFY="VERIFY",
    RESET="RESET"
}

export const sendEmail = async({email, emailType, userId}:any)=>{
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if(emailType === EMAIL_TYPE.VERIFY)
        {
            await User.findByIdAndUpdate(userId,{
                verifyToken:hashedToken,
                verifyTokenExpiry:Date.now()+3600000
            })
        }
        else if(emailType === EMAIL_TYPE.RESET)
        {
            await User.findByIdAndUpdate(userId,{
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry:Date.now()+3600000
            })
        }

        const emailSubject = emailType===EMAIL_TYPE.VERIFY?
        "Verify your email":
        "Reset your Password"

        const emailHTML = `<h2>MockInter</h2><p>Click <a href="${process.env.DOMAIN}/${emailType===EMAIL_TYPE.VERIFY?"verifyemail":"resetpassword"}?email=${email}&token=${hashedToken}">here</a> to ${emailType===EMAIL_TYPE.VERIFY?"verify your email":"reset your password"}</p>`

        const mailOptions = {
            from:'pateldivyesh1323@gmail.com',
            to:email,
            subject:emailSubject,
            html:emailHTML
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USERID,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    
    } catch (error:any) {
        throw new Error(error.message);
    }
}