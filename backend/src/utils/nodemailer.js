import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

export async function sendEmail(to, subject, body){
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: body
    }
    try {
        const res = await transporter.sendMail(mailOptions)
        return res; 
    } catch (error) {
        throw error
    }
}
