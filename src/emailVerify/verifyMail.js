import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const verifyMail = async (token, email) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mailUser,
      pass: process.env.mailPass,
    },
  });

  const mailConfigurations = {
    from: process.env.mailUser,
    to: email,
    subject: "Email Verification!!!!!!!!!",
    // text: `Hello User, Kindly Verify {{token}} `
    text:`Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5173/user/verify/${token} 
           Thanks`
   
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};