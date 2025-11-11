import User from "../models/user.model.js";
import { sendEmail } from "../utils/nodemailer.js";

export async function sendForgotPasswordMail(req, res){
    try {
        const {email} = req.body;
        const existingUser = await User.findOne({where: {email: email}});
        
        if(!existingUser){
            return res.status(404).json({msg: "No such user exist with given email!"});
        } 

        const subject = 'Forgot password';
        const newPassword = Math.floor(Math.random() * 1000000);
        const update = await existingUser.update({password: newPassword});
        const body = `
            <p>Your password has been changed to ${newPassword}</p>
            <p>Login and change it asap as it is temporary password!</p>
            `;
        const result = await sendEmail(email, subject, body);
        console.log(result)
        return res.status(200).json({msg:"Mail sended successfully!", result});
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Something went wrong while sending mail!", error})
    }
}