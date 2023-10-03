import nodemailer from "nodemailer";
import User from "../database/models/UserModel";
import bcryptjs from "bcryptjs";
import { connectDB } from "../database/mongodb";
import { Types } from "mongoose";

connectDB();

const enum EMAIL_TYPE {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

type EmailParamType = {
  email: string;
  emailType: string;
  userId: Types.ObjectId;
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: EmailParamType) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === EMAIL_TYPE.VERIFY) {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === EMAIL_TYPE.RESET) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const emailSubject =
      emailType === EMAIL_TYPE.VERIFY
        ? "Verify your email"
        : "Reset your Password";

    const emailHTML = `<h2>MockInter</h2><p>Click <a href="${process.env.DOMAIN
      }/${emailType === EMAIL_TYPE.VERIFY ? "verifyemail" : "resetpassword"
      }?email=${email}&token=${hashedToken}">here</a> to ${emailType === EMAIL_TYPE.VERIFY
        ? "verify your email"
        : "reset your password"
      }</p>`;

    const mailOptions = {
      from: "support@mockinter.com",
      to: email,
      subject: emailSubject,
      html: emailHTML,
    };

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERID,
        pass: process.env.MAILTRAP_PASS,
      },
    });
    await transport.sendMail(mailOptions);
    return { success: true, message: emailType === EMAIL_TYPE.VERIFY ? "Verification mail sent!" : "Reset-Password mail sent!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
